---
title: Deploy Express API to Kubernetes Cluster on Azure
thumbnail: /assets/logo_2.png
date: 2021-12-14T19:31:21.081Z
keywords:
draft: true
category:
---

## Create a NodeJs Express API

### Create Application Docker Image

#### Build Docker Image

Build docker image and push to container registry.

```bash
docker build -t node-ts-api .
```

### Create a React Client Application

### Create Application Docker Image (nginx)

## Setup Infastructure as Code (IAC) using ARM Templates

This section covers creating a YAML config to deploy 3 resources to Azure.

- Deploy Kubernetes Cluster
- Deploy SQL Server and Database
- Deploy Container Registry

## Setup Kubernetes Deployment Pipeline

This section covers deploying docker containers to Kubernetes.

- React Client
- NodeJs Express API

### Configuration

Setup environment variables for the Kubernetes deployment object and service object.

### References:

**Deploying a Kubernetes Cluster to Azure Pipelines**
https://learn.microsoft.com/en-us/azure/aks/devops-pipeline?tabs=cli&pivots=pipelines-yaml
https://azuredevopslabs.com/labs/vstsextend/kubernetes/

**ARM Templates**
https://learn.microsoft.com/en-ca/azure/azure-resource-manager/templates/template-tutorial-create-first-template?tabs=azure-powershell&WT.mc_id=azuredevops-azuredevops-jagord
