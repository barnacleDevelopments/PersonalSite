---
title: Troubleshooting Race Conditions in Inventory Management with Azure Event Grid and Service Bus
thumbnail: /assets/photo-1521192520982-5d6ca468a30f.jpg
date: 2024-06-08T00:00:00.000Z
keywords: inventory management, race conditions, azure event grid, azure service bus, azure functions, troubleshooting
draft: true
category: cloud
---

I recently encountered a bug with an inventory management codebase that utilizes several Azure services, and I wanted to share my experience. The system's primary function is to manage raw and packaging material quantities—raw materials being biomaterials and packaging being self-explanatory. The system also performs other actions, such as calculating average costs, but that is beyond the scope of this article.

## The Problem

The bug was related to a microservice architecture decision to sync the total quantity of a material between two databases. Unfortunately, one of these databases was intermittently getting out of sync, causing cascading issues across the application.

The solution to this problem is simple but requires understanding the technologies used. To achieve this syncing behavior, we have been using three different services: Azure Event Grid, Azure Service Bus, and Azure Functions.

After learning about these technologies in more depth, I found that the issue was with Azure Event Grid. To better explain the cause, I'll describe what each of these technologies does and what they are used for.

## The Tech

**Azure Functions** are serverless functions that can perform some work and then shut down when they are no longer needed. An important point is that more instances of these functions fire up when they are needed (this fact is important).

**Azure Event Grid** is a technology designed to perform actions when events occur. These actions could be to trigger an Azure Function that sends off an email or triggers a file upload, etc. In Azure, these actions are described as subscriptions to events.

**Azure Service Bus** is a similar technology designed to also perform actions when events occur. It is different from Azure Event Grid because instead of handling events at any time, it handles them in a queue. In other words, Event Grid is "fire and forget," and Service Bus is "fire and don't forget."

## The Implementation

Now to describe the implementation of these technologies within our inventory management system before we resolved the issue.

### Azure Functions

We have three Azure Function apps that perform three separate functions.

- **Function A**: Inventory Management
  - Handles all inventory-related operations.
- **Function B**: Brew Run Management
  - Handles brew run-related operations.
- **Function C**: Inventory Processor
  - Handles total material inventory calculations
  - Handles average cost of material calculations.

Both Function A and Function B use separate databases. Function C processes inventory transactions created by Function A and Function B using the Service Bus and Event Grid.

### Service Bus

The Service Bus has a material update queue that is filled by Function App C with the latest material quantity events after it has completed processing its transactions. Function App A listens to this queue and takes the latest material quantity and applies it to its own database. Once that is completed, it creates an event on the Event Grid to update Function B's database's material quantity. This whole process is the problem. Shall we continue?

### Event Grid

When a material update event is added to the Event Grid, a subscription listens to it and triggers a function on Function App B to update its database's material quantity. The core of the issue lies here in the Event Grid. The Event Grid is not intended to be used for database syncing.

## Understanding the Problem

The problem here is that the Event Grid is being used to handle database syncing. Database syncing is typically done using a queue-based service like the Azure Service Bus. This is because each service handles events differently, as described previously.

## Solving the Problem

The solution to the problem was easy. We removed the Event Grid from the process because it is not intended for this purpose. Then, we replaced the update material quantity function on Function App B with a Service Bus trigger function that listens to the same event that the update material quantity function on Function App A listens to. Voila, we fixed the problem. Now, when Azure Function App C finishes processing transactions and creates a new event on the Service Bus, both A and B get triggered to update their databases.
