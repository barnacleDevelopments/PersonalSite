---
title: Bevel All-In-One Tutorial
thumbnail: /assets/logo_2.png
date: 2024-12-09T15:13:45.129Z
keywords: hyperledger fabric, hyperledger bevel
category: hyperledger
draft: true
---

I started learning about Hyperledger Bevel and I wanted to provide a all in one tutorial covering a basic development setup. I'll later write a tutorial for a production setup which I will link to here.

## What is Bevel?

Hyperledger Bevel is a deployment framework for permissioned blockchains. It's aim is to facilitate the process of complex production deployments for frameworks like Hyperledger Fabric. One of the main stunting factors effecting the adoption of permissioned blockchains is that they are inhrently difficult to deploy and manage. Any effort to make this deployment process easier will be nessisary to increase adoption.

## What is this Tutorial for?

This tutorial is quick and dirty reference for setting up a local development environment with Bevel. If you want to setup your environment on a VM The documentation provided by Hyperledger is thorough and I recommend going through it. For those who don't want to navigate multiple different pages to get a development environment setup, I have created this tutorial. I will leave links throughout to different resources so that you can learn how Bevel works. Your welcome!

## Step 1: Setup Virtual Machine with Minikube

1. Download ISO for Ubuntu 20.04.

2. Download Virtual Box or a prefered virtual environment.

3. Setup a machine with 16gb of ram, 8 vcpu and public IP address (so you can access your Kubernetes Cluster from your host machine).

4. For steps 1.a through 1.f run all commands inside the VM.

### Step a: Setup a project

1. This is the directory what we will be working out of going forward. I have named in `bevel-sample-project` but your can name it whatever you want.

```bash
mkdir bevel-sample-project/bin
mv vault bevel-sample-project/bin
export PATH=./bevel-sample-project/bin:$PATH
```

### Step b: Setup Hashi Vault

1. Install the binnary for Hashi Vault: https://www.vaultproject.io/downloads/

2. Create a config.hcl file inside the `bevel-sample-project` directory.

```
echo "ui = true
storage "file" {
   path    = "./project/data"
}
listener "tcp" {
   address     = "0.0.0.0:8200"
   tls_disable = 1
}" > config.hcl
```

3. start the vault server.

```bash
vault server -config=config.hcl
```

4. Navigate to http://localhost:8200/.

5. Enter "1" for Key Shares, enter "1" for Key Threshold, and press initialize.

6. Click copy the keys. Then click Continue to Unseal. Provide the unseal key first and then the root token to login. Keep a copy of these keys for later reference.

7. Visit the documentation and [take the basic tutorial](https://developer.hashicorp.com/vault/tutorials/get-started).

## Step c: Setup Minikube

1. Install Minikube

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

2. Start minikube instance on your machine

```bash
minikube start --memory 12000 --cpus 4 --kubernetes-version=1.23.1 --apiserver-ips=<specify public ip of VM>
```

3. [Visit the documentation](https://minikube.sigs.k8s.io/docs/start/?arch=%2Flinux%2Fx86-64%2Fstable%2Fbinary+download).

## Step d: Fork Bevel

1. The bevel respository contains all the nessisary files for you to work with Bevel

```bash
git clone https://github.com/hyperledger-bevel/bevel
```

2. Create a local branch for bevel

```
cd bevel
git checkout develop # to get latest code
git pull
git checkout -b local
git push --set-upstream origin local
```

3. [Visit the documentation](https://hyperledger-bevel.readthedocs.io/en/latest/).

### Step e: Setup Bevel
