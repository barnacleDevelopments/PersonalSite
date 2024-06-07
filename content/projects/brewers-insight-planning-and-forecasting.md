---
id: fe925bea-43f4-423e-84f9-a4c452f59f5a
title: BrewersInsight - Planning and Forecasting
description: Brewer manage large amounts of different materials to produce beer which can become a burdensome task to manage. For instance, a brewer could order too much or too little materials during their production phase resulting in wasted time and resources. Planning & Forecasting is a software feature I developed, while working with WarrierTech, to help brewers manage these materials according to a production plan. The solution is facilitated through two views including a gantt chart for planning brews and a forecasting table to see upcoming materials shortages.
image1: /assets/planner_1.png
tech: This feature was developed using the BI tech stack consisting of the Angular framework, Azure Functions, CosmosDB and MSSQL.
image2: /assets/planner_2.png
challenges: The most challenging part of developing this feature was its integration with the current *brew run system*. Brew runs are composed from of a series of CosmosDB Documents. Namely, the core brew run details, turn details, fermentation details, conditioning details and packaging details. All together they represent the data of one full beer production. Normally, these details were created dynamically through the process of completing a brew run. With the integration of the planner, these details were pre-populated. This resulted in a series of cascading refactors because the original system was not originally designed with that in mind. This taught me a lot about the system but also a hard lesson in systems integration.
image3: /assets/planner_3.png
liveLink: ""
githubLink: ""
date: 2024-01-01T12:13:10.205Z
completeTime: 400
keywords: BrewersInsight, Brewer's Insight, Planner and Forecasting, Planner, Forecasting
---
