---
title: Managing ExpressJs API Kubernetes Deployment with Flux
thumbnail: /assets/kubernetes-devops.webp
date: 2025-01-01T19:31:21.081Z
keywords: kubernetes, azure, devops, node.js, express, docker, bicep templates, azure pipelines, ci/cd, aks, azure container registry
draft: true
category: programming
---

This tutorial is a continuation of my previous guide on deploying an [ExpressJS application to AKS](/blog/deploy-express-app-to-kubernetes-on-azure). If you haven’t already, I recommend reviewing that tutorial before diving into this one. In the previous guide, we explored a CI/CD deployment strategy using Azure DevOps with Bicep files. In this tutorial, we’ll take it a step further by removing the deployment step from the pipeline and adopting a declarative approach with GitOps, powered by Flux.

Flux leverages GitOps to manage Kubernetes clusters declaratively. It does so by deploying agents on the cluster that continuously monitor configuration files stored in a Git repository and reconcile any differences. This ensures that Kubernetes infrastructure consistently reflects the desired state of the application. While setting up Flux can involve some complex configuration, once in place, it seamlessly works with Kubernetes to maintain the desired state. This tutorial will walk you through deploying an Express JS API to Kubernetes using Flux.

## Prerequisites

- Review my [previous tutorial](/blog/deploy-express-app-to-kubernetes-on-azure) on deploying Express js api to AKS.

- [Install K3D](https://k3d.io/stable/) for a local cluster for testing purposes.

- [Install Flux](https://fluxcd.io/flux/installation/#install-the-flux-cli)

## Create Cluster

First you'll need to startup a fresh Azure Kubernetes Service (AKS) and Azure Container Registry (ACR) deployment. We will utilize Bicep files to declaratively deploy these resources to Azure using Azure CLI.

**Create a bicep file to describe you resources.**

```bicep
// General
param location string = resourceGroup().location
param resourceGroupName string = resourceGroup().name
param subscriptionId string = subscription().subscriptionId

// Kubernetes Cluster
param clusterName string = 'devdeveloper-aks-cluster'
param nodeSize string = 'Standard_A2_v2'
param nodeCount int = 1
param k8sVersion string = ''

// Container Registry
param containerRegistryName string = 'devdeveloperregistry'

// Reference: https://learn.microsoft.com/en-us/azure/templates/microsoft.containerregistry/registries?pivots=deployment-language-bicep
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2022-12-01' = {
  name: containerRegistryName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: false
  }
}

// Template Reference: https://learn.microsoft.com/en-us/azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep
// Manage Node Pools Reference: https://learn.microsoft.com/en-us/azure/aks/use-system-pools?tabs=azure-cli
resource devDeveloperCluster 'Microsoft.ContainerService/managedClusters@2024-09-01' = {
  location: location
  name: clusterName
  sku: {
    name: 'Base'
    tier: 'Free'
  }
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    agentPoolProfiles: [
      {
        count: nodeCount
        name: 'nodepool1'
        osDiskSizeGB: 30
        osType: 'Linux'
        vmSize: nodeSize
        mode: 'System'
      }
    ]
    dnsPrefix: 'minimalaks'
  }
}

output aksPrincipalId string = aks.identity.principalId
```

**Create resource group**

```bash

az group create --resource-group KubernetesTest --location canadaeast

```

**Deploy resources to Azure**

```bash

az deployment group create --resource-group kubernetesTest --template-file azuredeploy.bicep

```

**Create new role assignment to give AKS AcrPull access.**

```bash
az aks show --resource-group KubernetesTest --name devdeveloper-aks-cluster --query "identityProfile.kubeletidentity.objectId" -o tsv

az role assignment create --assignee ed6b1c8a-ca84-4041-9d87-da92420c8565 --role "AcrPull" --scope /subscriptions/d8ba9377-cef7-4515-af2b-dca92421761b/resourceGroups/KubernetesTest/providers/Microsoft.ContainerRegistry/registries/devdeveloperregistry
```

**Register aks deployment with Kubectl**

```bash

az aks get-credentials --resource-group KubernetesTest --name devdeveloper-aks-cluster

```

## Prepare ExpressJS API for Flux

Create a `kustomization.yaml` file inside the manifest directory of the ExpressJS repository.

```yaml
  apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployment.yaml
  - service.yaml
```

Modify the deployment.yaml file with ImagePolicy comment and set the initial tag to 0. This will allow flux to identity the field it needs to update when a new image is uploaded to our ACR.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-ts-api
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-ts-api
  template:
    metadata:
      labels:
        app: node-ts-api
    spec:
      containers:
        - name: nodetsapi
          image: devdeveloperregistry.azurecr.io/node-ts-api:0 # {"$imagepolicy": "flux-system:node-ts-api"} <=== add this comment and change intial tag
          ports:
            - containerPort: 3000
```

## Setup Azure Devops Pipeline

Now we need to setup the Azure Devops Pipeline. Like mentioned before this is a similar setup to the previous tutorial but with the deployment step to AKS removed because Flux will be handeling that going forward. This will be automatically generated by Azure Pipelines and you'll only have to make slight motifications based on your setup. Take a look inside the code snippet bellow for comments.

```yaml
trigger:
  - version_2

resources:
  - repo: self

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: "766a7075-56b5-40d1-8d79-2d89a8710f11"  <=== automatically generated
  imageRepository: "node-ts-api"                                           <=== this is going to be the name of the image repository and will be refered to later
  containerRegistry: "devdeveloperregistry.azurecr.io"                     <=== make sure that the container registry matches the resource in Azure
  dockerfilePath: "**/Dockerfile"                                          <=== make sure that your docker file matches the one inside the repository
  tag: "$(Build.BuildId)"                                                  <=== this is a tag which Flux will refer to when changes are made to the image.
  imagePullSecret: "devdeveloperregistry41003ccd-auth"

  # Agent VM image name
  poolName: "Personal Laptop"                                              <=== this is the agent we will use for building the image artifacts.

stages:
  - stage: Build
    displayName: Build stage
    jobs:
      - job: Build
        displayName: Build
        pool:
          name: $(poolName)
        steps:
          - task: Docker@2
            displayName: Build and push an image to container registry
            inputs:
              command: buildAndPush
              repository: $(imageRepository)
              dockerfile: $(dockerfilePath)
              containerRegistry: $(dockerRegistryServiceConnection)
              tags: |
                $(tag)

          - upload: manifests
            artifact: manifests
```

## Test out application in local development

The power of Kubernetes is that each application within a system is running inside it's own container independent of other containers. This makes it easy for teams to develop applications inside an isolated environment. Try running your application inside a local k3d cluster. The `-k` flag tells kubectl to apply the resource manifest files inside the `kustomization.yaml` file. Make sure that your Pipeline has at least uploaded one image to the container registry.

```bash

k3d cluster create

kubectl apply -k ./manifests/

```

Check that the services and deployments are up and running.

```bash
kubectl get services,deployments

// Output
NAME          TYPE           CLUSTER-IP     EXTERNAL-IP   PORT(S)          AGE
kubernetes    ClusterIP      10.43.0.1      <none>        443/TCP          8m12s
node-ts-api   LoadBalancer   10.43.180.22   172.19.0.3    8080:32289/TCP   5m25s

```

## Setup Flux

Here we setup a new repository for the main Flux Configuration. This is the repository that our Kubernetes cluster will interact with and watch for changes.

```bash
flux bootstrap github \
  --owner=$GITHUB_USER \
  --repository=flux-kubernetes-test \
  --branch=main \
  --path=./clusters/test-cluster \
  --personal \
  --components-extra image-reflector-controller,image-automation-controller #<=== add extra components to automate image updates
```

Now clone the respository:

```bash

git clone https://github.com/$GITHUB_USER/flux-kubernetes-test

cd flux-kubernetes-test

```

By the end of this section your Flux repository structure should look like this.

```
test-cluster/
├── flux-system/
│   ├── kustomization.yaml       # Main kustomization file for Flux configuration
|   └── flux-kubernetes-test-source.yaml # GitRepository
├── apps/
│   └── my-app/
│       ├── kustomization.yaml    # Defines kustomization for the app
│       └── deployment.yaml       # Kubernetes Deployment manifest (uses image tag)
└── README.md                     # Documentation about the setup
```

### Add ExpressJS API Repositoy to Flux

The next step is to add a `GitRepository` object referencing the ExpressJS application repository to the Flux repository so that it becomes aware of its manifest files. Notice that we are creating a file `flux-kubernetes-test-source.yaml` under the `/clusters/test-cluster/` directory of the Flux configuration repository we just cloned.

```bash
flux create source git flux-kubernetes-test \
  --url=https://github.com/barnacleDevelopments/kubernetes-test
  --branch=version_2 \
  --interval=1m \
  --export > ./clusters/test-cluster/flux-kubernetes-test-source.yaml
```

View the `flux-kubernetes-test-source.yaml` file that was created.

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  interval: 1m
  ref:
    branch: version_2
  url: https://github.com/$GITHUB_USER/kubernetes-test
```

the next few objects will go in the same file.

### Add Azure Container Registry by creating an ImageRepository object

The Azure container registry is where the Docker images for our ExpressJS application will be stored after they have been built in our CI/CD Azure Devops Pipeline. This is not to be confused with the `GitRepository` object. This object will configure Flux to watch for new images and trigger Kubernetes to re-deploy the application.

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  image: devdeveloperregistry.azurecr.io/node-ts-api #<=== this is the address of our image
  interval: 1m #<=== we are checking every hour
  provider: azure
```

### Create ImagePolicy object

The image policy object will tell Kubernetes how to select the latest image from our container registry.

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: node-ts-api # <=== reference to the ImageRepository object.
  policy:
    numerical:
      order: asc # <=== the image we would like to select (the latest image in this case)
```

### Create ImageUpdateAutomation object

This object tells Kubernetes how often to check our ExpressJS repository for changes.

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageUpdateAutomation
metadata:
  name: node-ts-api-automation
  namespace: flux-system
spec:
  interval: 5m #<=== check the repository every 5 minutes for changes
  sourceRef:
    kind: GitRepository
    name: node-ts-api #<=== use the node-ts-api GitRepository object
  git:
    checkout:
      ref:
        branch: version_2
    push:
      branch: version_2
    commit:
      author:
        email: devin@mailfence.com
        name: devin
  update:
    path: ./manifests
```

### Complete Config

```yaml
---
apiVersion: source.toolkit.fluxcd.io/v1
kind: GitRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  interval: 1m0s
  ref:
    branch: version_2
  url: https://github.com/barnacleDevelopments/kubernetes-test
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  image: devdeveloperregistry.azurecr.io/node-ts-api #<=== this is the address of our image
  interval: 1m #<=== we are checking every hour
  provider: azure
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageUpdateAutomation
metadata:
  name: node-ts-api-automation
  namespace: flux-system
spec:
  interval: 5m #<=== check the repository every 5 minutes for changes
  sourceRef:
    kind: GitRepository
    name: node-ts-api #<=== use the node-ts-api GitRepository object
  git:
    checkout:
      ref:
        branch: version_2
    push:
      branch: version_2
    commit:
      author:
        email: devin@mailfence.com
        name: devin
  update:
    path: ./manifests
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImagePolicy
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  imageRepositoryRef:
    name: node-ts-api # <=== reference to the ImageRepository object.
  policy:
    numerical:
      order: asc # <=== the image we would like to select (the latest image in this case)
```

Commit and push changes to github.

```bash
git add -A && git commit -m "Add flux-kubernetes-test GitRepository"
git push
```

### Deploy the Expresss JS Application

Next, we are creating a kustomization object. This object tells flux where the manifest configurations are in our ExpressJS Application repository and how often to check them for changes. Notice that we are creating a file `flux-kubernetes-test-kustomization.yaml` under the `/clusters/test-cluster/` directory of the Flux Configuration Repository we just cloned.

```bash
flux create kustomization flux-kubernetes-test \
  --target-namespace=default \
  --source=node-ts-api \
  --path="./manifests" \
  --prune=true \
  --wait=true \
  --interval=30m \
  --retry-interval=2m \
  --health-check-timeout=3m \
  --export > ./clusters/test-cluster/flux-kubernetes-test-kustomization.yaml
```

Commit and push changes to Github.

```bash
git add -A && git commit -m "Add flux-kubernetes-test Kustomization"
git push
```

### Watch your Flux Agent

Now let's watch Flux and Kuberenets do their work reconsiling this deployment:

```bash
flux get kustomizations --watch
```

In another terminal look at the deployments and services:

```bash
kubectl -n default get deployments,services
```

## Bringing it all Together

In the [previous tutorial]() we demonstrated uploading new Docker images of our ExpressJS application to our Azure Container Registry. Once this image was uploaded, Azure Pipelines trigged AKS to pull the latest image from the registry to re-deploy the updated image to Kubernetes pods. Now because we are utilizing Flux to manage deployments to Kubernetes, our pipeline simply needs to handle the build and upload to the container registry and Flux will handle the rest.

1. Now let's update our ExpressJS application with a new route.

```typecript


```

2. Then push those changes to GitHub.

```bash
git add .

git commit -m "New route afte Flux setup"

git push
```

3. View images being built on Azure and uploaded to container registry.

4. Monitor our pods re-deploying.

```bash

```

## Resources
