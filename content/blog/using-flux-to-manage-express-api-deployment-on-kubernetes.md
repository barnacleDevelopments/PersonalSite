---
title: Managing ExpressJs API Kubernetes Deployment with Flux
thumbnail: /assets/kubernetes-devops.webp
date: 2025-01-17T19:31:21.081Z
keywords: kubernetes, azure, devops, node.js, express, docker, bicep templates, azure pipelines, ci/cd, aks, azure container registry, flux
draft: false
category: devops
---

Flux is a powerful declarative system to manage your Kubernetes deployments.

## Prerequisite

- Review my [previous tutorial](/blog/deploy-express-app-to-kubernetes-on-azure) on deploying Express js api to AKS.

- [Install K3D](https://k3d.io/stable/) for a local cluster for testing purposes.

- [Install Flux](https://fluxcd.io/flux/installation/#install-the-flux-cli)

- [Install Terraform CLI](https://developer.hashicorp.com/terraform/tutorials/cloud-get-started/cloud-login)

- [Pull Latest Project Image](https://github.com/barnacleDevelopments/kubernetes-test/tree/version_2)

## Create Cluster

First you'll need to startup a fresh Azure Kubernetes Service (AKS) and Azure Container Registry (ACR) deployment. We will utilize Bicep files to declaratively deploy these resources to Azure using Azure CLI.

**Create a bicep file to describe you resources.**

```tf
# Configure the Azure provider
terraform {
  required_version = ">=1.0"

  required_providers {
    azapi = {
      source  = "azure/azapi"
      version = "~>1.5"
    }
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~>3.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~>3.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "0.9.1"
    }
  }
}

provider "azurerm" {
  features {}
}

# Variables

resource "azapi_resource_action" "ssh_public_key_gen" {
  type        = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  resource_id = azapi_resource.ssh_public_key.id
  action      = "generateKeyPair"
  method      = "POST"

  response_export_values = ["publicKey", "privateKey"]
}

resource "azapi_resource" "ssh_public_key" {
  type      = "Microsoft.Compute/sshPublicKeys@2022-11-01"
  name      = var.ssh_key_name
  location  = azurerm_resource_group.rg.location
  parent_id = azurerm_resource_group.rg.id
}

output "key_data" {
  value = azapi_resource_action.ssh_public_key_gen.output.publicKey
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "KubernetesTest"
  location = var.location
}

# Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.container_registry_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  sku                 = "Basic"
  admin_enabled       = false

  identity {
    type = "SystemAssigned"
  }
}

# Kubernetes Cluster
resource "azurerm_kubernetes_cluster" "k8s" {
  location            = azurerm_resource_group.rg.location
  name                = var.azurerm_kubernetes_cluster_dns_name
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = var.azurerm_kubernetes_cluster_dns_prefix

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "agentpool"
    vm_size    = "Standard_A2_v2"
    node_count = var.node_count
  }
  linux_profile {
    admin_username = var.username

    ssh_key {
      key_data = azapi_resource_action.ssh_public_key_gen.output.publicKey
    }
  }
  network_profile {
    network_plugin    = "kubenet"
    load_balancer_sku = "standard"
  }
}
```

**Deploy resources to Azure**

```bash
terraform apply
```

**Create new role assignment to give AKS AcrPull access.**

```bash
az aks show --resource-group KubernetesTest --name devdeveloper-aks-cluster --query "identityProfile.kubeletidentity.objectId" -o tsv

az role assignment create --assignee ed6b1c8a-ca84-4041-9d87-da92420c8565 --role "AcrPull" --scope /subscriptions/59966e90-8185-44af-a00c-13bc237e59cb/resourceGroups/KubernetesTest/providers/Microsoft.ContainerRegistry/registries/devdeveloperregistry
```

**Register aks deployment with Kubectl**

```bash

az aks get-credentials --resource-group KubernetesTest --name devdeveloper-aks-cluster

```

## Prepare ExpressJS API for Flux

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
          image: devdeveloperregistry.azurecr.io/node-ts-api:0 # {"$imagepolicy": "flux-system:node-ts-api"} # <=== add this comment and change intial tag
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

The power of Kubernetes is that each application within a system is running inside it's own container independent of other containers. This makes it easy for teams to develop applications inside an isolated environment.

### Create K3D cluster and local registry

```bash
k3d cluster create test-cluster --registry-create test-cluster-registry.localhost --port 44397
```

### Upload ExpressJS app image to local registry

```bash
docker build -t node-ts-api . -f Dockerfile.dev

docker tag node-ts-api:latest test-cluster-registry.localhost:36741/node-ts-api:local

docker push test-cluster-registry.localhost:36741/node-ts-api:local
```

### Run Application

Try running your application inside a local k3d cluster. The `-k` flag tells kubectl to apply the resource manifest files inside the `kustomization.yaml` file.

```bash
kubectl apply -k ./manifests/overlays/dev
```

Check that the services and deployments are up and running.

```bash
kubectl get services,deployments

// Example Output:
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
  --components-extra image-reflector-controller,image-automation-controller #<=== add extra components to automate image updates \
  --read-write-key=true
```

Now clone the respository:

```bash

git clone https://github.com/$GITHUB_USER/flux-kubernetes-test

cd flux-kubernetes-test

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
  interval: 1m0s
  ref:
    branch: version_2
  url: https://github.com/barnacleDevelopments/kubernetes-test
  secretRef:
    name: kubernetes-test-auth
```

Create secret to authenticate with repository. This is different from the personal access token (PAT) provided when bootstraping flux.

```bash
kubectl create secret generic flux-git-auth --namespace flux-system --from-literal=username=barnacleDevelopments --from-literal=password=$GITHUB_PAT
```

the next few objects will go in the same file.

### Add Azure Container Registry

The Azure container registry is where the Docker images for our ExpressJS application will be stored after they have been built in our CI/CD Azure Devops Pipeline. This is not to be confused with the `GitRepository` object. This object will configure Flux to watch for new images and trigger Kubernetes to re-deploy the application.

```yaml
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  image: devdeveloperregistry.azurecr.io/node-ts-api #<=== this is the address of our image
  interval: 1h #<=== we are checking every hour
  provider: azure
```

### Add ImagePolicy object

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

### Add ImageUpdateAutomation object

This object tells Kubernetes how often to check our ExpressJS repository for changes and where to update the latest image tag.

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
    path: ./manifests/overlays/prod
    strategy: Setters
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
  secretRef:
    name: kubernetes-test-auth
---
apiVersion: image.toolkit.fluxcd.io/v1beta2
kind: ImageRepository
metadata:
  name: node-ts-api
  namespace: flux-system
spec:
  image: devdeveloperregistry.azurecr.io/node-ts-api #<=== this is the address of our image
  interval: 1h #<=== we are checking every hour
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
    path: ./manifests/overlays/prod
    strategy: Setters
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
  --path="./manifests/overlays/prod" \
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

In the [previous tutorial](/blog/deploy-express-app-to-kubernetes-on-azure) I demonstrated uploading new Docker images of our ExpressJS application to our Azure Container Registry. Once this image was uploaded, Azure Pipelines trigged AKS to pull the latest image from the registry to re-deploy the updated image to Kubernetes pods. Now because we are utilizing Flux to manage deployments to Kubernetes, our pipeline simply needs to handle the build and upload to the container registry and Flux will handle the rest.

1. Now let's update our ExpressJS application with a new route.

```typecript
app.get("/flux", (req: Request, res: Response) => {
  res.send("Welcome to Flux!");
});
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
kubectl get pods
```

## Resources

https://fluxcd.io/flux/cheatsheets/troubleshooting/
https://registry.terraform.io/