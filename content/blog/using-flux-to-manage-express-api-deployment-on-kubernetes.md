---
title: Managing ExpressJs API Kubernetes Deployment with Flux
thumbnail: /assets/kubernetes-devops.webp
date: 2025-01-01T19:31:21.081Z
keywords: kubernetes, azure, devops, node.js, express, docker, bicep templates, azure pipelines, ci/cd, aks, azure container registry
draft: true
category: programming
---

This is a continuration of my previous tutorial on deploying an [ExpressJS application to AKS](/blog/deploy-express-app-to-kubernetes-on-azure). I encourage you to view that tutorial before proceeding with this one. The previous tutorial demonstrated using a CI/CD deployment strategy utilizing Azure DevOps bicep files. In this tutorial we will be removing the deployment step from the pipeline to replace it with a declarative approach utilizing GitOps and Flux.

Flux utilizes GitOps to declaritively manage Kubernetes clusters. It achieves this with agents that are installed on the cluster and who regularly check the state of configuration files stored on a git repository and reconsile any changes. This insures that the Kubernetes infastructure maintains the desired state of the application. This tutorial demonstrates deploying an Express JS API to Kubernetes utilizing Flux.

## Prerequisites

- Review my [previous tutorial](/blog/deploy-express-app-to-kubernetes-on-azure) on deploying Express js api to AKS.

- [Install Flux](https://fluxcd.io/flux/installation/#install-the-flux-cli)

## Create Cluster

First you'll need to startup a fresh Kubernetes Deployment locally or on the Cloud. We will do an Azure AKS deployment for this example.

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

**Create a new bicep file for authenticating flux with Azure Container Registry.**

```bicep


```

**Create resource group**

```bash

az group create --resource-group KubernetesTest --location canadaeast

```

**Deploy resources to Azure**

```bash

az deployment group create --resource-group kubernetesTest --template-file azuredeploy.bicep

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

## Test out application in local development

The power of Kubernetes is that each application within a system is running inside it's own container independent of other containers. This makes it easy for teams to develop applications inside an isolated environment. Try running your application inside a local k3d cluster. The `-k` tells kubectl to apply the resource manifest files inside the `kustomization.yaml` file.

```bash

k3d cluster create

kubectl apply -k ./manifests/

```

Check that the services are running.

```bash
kubectl get services

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
  --repository=flux-kuberntes-test \
  --branch=main \
  --path=./clusters/test-cluster \
  --personal
```

Now clone the respository:

```bash

git clone https://github.com/$GITHUB_USER/flux-kubernetes-test

cd flux-kubernetes-test

```

## Add ExpressJS API Repositoy to Flux

The next step is to add the Express application to flux so that it becomes aware of it. Notice that we are creating a file `flux-kubernetes-test-source.yaml` under the `/clusters/test-cluster/` directory of the Flux Configuration Repository we just cloned.

```bash
flux create source git flux-kubernetes-test \
  --url=https://github.com/barnacleDevelopments/kubernetes-test/tree/version_2 \
  --branch=master \
  --interval=1m \
  --export > ./clusters/test-cluster/flux-kubernetes-test-source.yaml
```

View the `flux-kubernetes-test-source.yaml` file that was created.

```yaml

```

Commit and push changes to github.

```bash
git add -A && git commit -m "Add flux-kubernetes-test GitRepository"
git push
```

## Deploy the Expresss JS Application

Next, we are creating a kustomization object. This object tells flux where the manifest configurations are in our ExpressJS Application repository and how often to check them for changes. Notice that we are creating a file `flux-kubernetes-test-kustomization.yaml` under the `/clusters/test-cluster/` directory of the Flux Configuration Repository we just cloned.

```bash
flux create kustomization flux-kubernetes-test \
  --target-namespace=default \
  --source=flux-kubernetes-test \
  --path="./manifest" \
  --prune=true \
  --wait=true \
  --interval=30m \
  --retry-interval=2m \
  --health-check-timeout=3m \
  --export > ./clusters/test-cluster/flux-kubernetes-test-kustomization.yaml
```

Commit and push changes to github.

```bash
git add -A && git commit -m "Add flux-kubernetes-test Kustomization"
git push
```

## Watch your Flux Agent

Now let's watch Flux and Kuberenets do their work reconsiling this deployment:

```bash
flux get kustomizations --watch

```

In another terminal look at the deployments and services:

```bash
kubectl -n default get deployments,services
```

## Update Azure Pipeline to Work with Flux

In the [previous tutorial]() we demonstrated uploading new Docker images of our ExpressJS application to our Azure Container Registry. Once this image was uploaded, Azure Pipelines trigged AKS to pull the latest image from the registry to re-deploy the updated image to Kubernetes pods. Now because we are utilizing Flux to manage deployments to Kubernetes, we need to configure our CI/CD pipeline to instead update our repository with the latest image uppon deployment.
