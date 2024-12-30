---
title: Deploy Express API to Kubernetes Cluster on Azure
thumbnail: /assets/logo_2.png
date: 2021-12-14T19:31:21.081Z
keywords:
draft: true
category:
---

This tutorial assumes some basic understanding of Azure CLI and Azure in general.

## Create a NodeJs Express API

We are going to create a basic API that will eventually be consumed by a React front-end.

### Create Application Docker Image

We want to create a docker image of our application to deploy it to Kubernetes.

```bash
npm i express
touch tsconfig.json
```

Build docker image and push to container registry.

```bash
docker build -t node-ts-api .
```

### Create a React Client Application

We want to create a docker image of our client application to be deployed on Kubernetes. We do this by creating a docker image that will start a nginx server to serve our client application.

## Setup Infastructure as Code (IAC) using Bicep Templates

https://learn.microsoft.com/en-ca/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-powershell&WT.mc_id=azuredevops-azuredevops-jagord

This section covers creating Bicep template to provision 3 resources to Azure.

- Deploy Kubernetes Cluster
- Deploy SQL Server and Database
- Deploy Container Registry

This comes in handy when we want to quickly setup and then tear down a set of resources. This makes it efficient to test a production deployment while saving money on valuable resource utilization.

**Create Template File**

```yaml

param location string = resourceGroup().location
param clusterName string = 'devdeveloper-aks-cluster'
param nodeSize string = 'Standard_A2_v2'
param nodeCount int = 1
param k8sVersion string = ''

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

resource devDeveloperSqlServer 'Microsoft.AzureData/sqlServerRegistrations/sqlServers@2019-07-24-preview' = {
  parent: resourceSymbolicName
  name: 'string'
  properties: {
    cores: int
    edition: 'string'
    propertyBag: 'string'
    registrationID: 'string'
    version: 'string'
  }
}
```

This bicep template file contains configurations for provisioning our resources. You can find a list of other resources in the [microsoft template documentation](https://learn.microsoft.com/en-us/azure/templates/).

**Deploy Template to Azure**
https://learn.microsoft.com/en-us/azure/templates/microsoft.containerservice/managedclusters?pivots=deployment-language-bicep

```bash
az group create --name myResourceGroup --location 'Central US'

templateFile="{provide-the-path-to-the-template-file}"
az deployment group create --name blanktemplate --resource-group myResourceGroup --template-file $templateFile
```

## Setup Kubernetes Deployment Pipeline using Azure DevOps

This section covers deploying docker containers to our Kubernetes cluster using Azure Pipelines. This allows us to push continiously update our application images. This is achieved using a two staged pipeline defined in a YAML pipeline file.

1. Stage One: Build Application and Update Azure Container Registry
2. Stage Two: Deploy Applications to Kubernetes Cluster

```yaml
# Deploy to Azure Kubernetes Service
# Build and push image to Azure Container Registry; Deploy to Azure Kubernetes Service
# https://docs.microsoft.com/azure/devops/pipelines/languages/docker

trigger:
  - master

resources:
  - repo: self

variables:
  # Container registry service connection established during pipeline creation
  dockerRegistryServiceConnection: "ee2f42af-176c-4aba-848c-785e5de67f77"
  imageRepository: "node-ts-api"
  containerRegistry: "devdeveloperregistry.azurecr.io"
  dockerfilePath: "**/Dockerfile.dev"
  tag: "$(Build.BuildId)"
  imagePullSecret: "devdeveloperregistry159782e3-auth"

  # Agent VM image name
  vmImageName: "Personal Laptop"

stages:
  - stage: Build
    displayName: Build stage
    jobs:
      - job: Build
        displayName: Build
        pool:
          name: $(vmImageName)
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

  - stage: Deploy
    displayName: Deploy stage
    dependsOn: Build

    jobs:
      - deployment: Deploy
        displayName: Deploy
        pool:
          name: $(vmImageName)
        environment: "barnacleDevelopmentskubernetestest-1754.default"
        strategy:
          runOnce:
            deploy:
              steps:
                - task: KubernetesManifest@0
                  displayName: Create imagePullSecret
                  inputs:
                    action: createSecret
                    secretName: $(imagePullSecret)
                    dockerRegistryEndpoint: $(dockerRegistryServiceConnection)

                - task: KubernetesManifest@0
                  displayName: Deploy to Kubernetes cluster
                  inputs:
                    action: deploy
                    manifests: |
                      $(Pipeline.Workspace)/manifests/deployment.yml
                      $(Pipeline.Workspace)/manifests/service.yml
                    imagePullSecrets: |
                      $(imagePullSecret)
                    containers: |
                      $(containerRegistry)/$(imageRepository):$(tag)
```

### Create Deployment Object

The deployment object is a wrapper around the ...

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
          image: devdeveloperregistry.azurecr.io/node-ts-api:latest
          ports:
            - containerPort: 3000
```

### Create Service Object

The service object defines the service node state and provides a consistent access point for the volitile Kubernetes pods that have a high IP churn rate.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-ts-api
spec:
  type: LoadBalancer
  ports:
    - port: 8080
      targetPort: 3000
  selector:
    app: node-ts-api
```

### References:

**Deploying a Kubernetes Cluster to Azure Pipelines**

- https://learn.microsoft.com/en-us/azure/aks/devops-pipeline?tabs=cli&pivots=pipelines-yaml
- https://azuredevopslabs.com/labs/vstsextend/kubernetes/

**ARM Templates**

- https://learn.microsoft.com/en-ca/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-powershell&WT.mc_id=azuredevops-azuredevops-jagord

**Ansible AKS Deployment**

- https://learn.microsoft.com/en-us/azure/developer/ansible/aks-configure-clusters?toc=%2Fazure%2Faks%2Ftoc.json&bc=%2Fazure%2Faks%2Fbreadcrumb%2Ftoc.json

**Self Hosted Azure Agents**

- https://learn.microsoft.com/en-us/azure/devops/pipelines/agents/linux-agent?view=azure-devops
