---
title: Troubleshooting Race Conditions in Inventory Management with Azure Event Grid and Service Bus
thumbnail: /assets/photo-1521192520982-5d6ca468a30f.jpg
date: 2024-06-08T00:00:00.000Z
keywords: inventory management, race conditions, azure event grid, azure service bus, azure functions, troubleshooting
draft: true
category: programming
---

I recently have been troubleshooting a bug with an inventory management system, designed using a few different Azure services, and wanted to share my experience. It's primary function is to manage raw and packaging material quantities. Raw materials being bio material and packaging is self explanatory. The system also performs a few different other actions like calculating average costs etc but that is beyond the scope of this article.

## The Problem

The bug is around a microservice architecture decision to sync the total quantity of a material between two databases. Unfortunately, one of these databases was intermittently getting out of sync causing cascading issues across the application.

The solution to this problem is simple but hard to resolve without understanding the technologies used. To achieve this syncing behavior, we have been using three different service. These being Azure Event Grid, Azure Service Bus and Azure Functions.

After learning about these technologies in more depth, I found that the issue was with Azure Event Grid. To better explain the cause I'll explain what each of these technologies do what what they are used for.

## The Tech

**Azure Functions** are serverless functions that can perform some work and then shut down when they are no longer needed. Another important point is that more instances of these functions fire up when they are needed (this fact is important).

**Azure Event Grid** is a technology designed to perform actions when events occur. These actions could be to trigger an Azure Function that sends off an email or trigger a file upload etc. In Azure these actions are described as subscriptions to events.

**Azure Service Bus** is a similar technology designed to also perform actions when events occur. It is different from Azure Event Grid because instead of handling events at any time it handles them in a queue. In other words, event grid is "fire and forget" and service bus is "fire and don't forget".

## The Implementation

Now to describe the implementation of these technologies within our inventory management system before we resolved the issue.

### Azure Functions

We have three Azure function apps that perform well three separate functions.

- _Function A_: Inventory Management
  - Handles all inventory related operations.
- _Function B_: Brew Run Management
  - Handles brew run related operations.
- _Function C_: Inventory Processor
  - Handles total material inventory calculations and average cost of material calculations.

### Service Bus

The Service Bus has a material update

### Event Grid

The event grid also has a material update event and a update brew run material quantities subscription that triggers a update material function on the brew run function app.

## Understanding the Problem

In our case we have been triggering a "material quantity update event" when a material is updated. Then we have a subscription to this event that triggers an Azure function to update the material quantity in question. To provide more clarity here are the steps to a material update whenever it happens.

It would help if I also explained how service bus works.

- Inventory Processor Function App gets triggered by a material quantity update event somewhere in our application. It retrieves all the transactions that ever happened to a material and adds up the total. It then fires off a Service Bus event. The inventory function app listens for this event updates it's inventory then it fires off a Event Grid Event.
- The

The problem with Azure Event Grid is it is "fire and forget". In other w

## Solving the Problem
