---
title: BrewersInsight - Planning and Forecasting
description: Brewer manage large amounts of different materials to produce beer which can become a burdensome task to manage. For instance, a brewer could order too much or too little materials during their production phase resulting in wasted time and resources. Planning & Forecasting is a software feature I developed, while working with WarrierTech, to help brewers manage these materials according to a production plan. The solution is facilitated through two views including a gantt chart for planning brews and a forecasting table to see upcoming materials shortages.
image1: /assets/project_photos/planning-and-forecasting-1.png
tech: This feature was developed using the BI tech stack consisting of the Angular framework, Azure Functions, CosmosDB and MSSQL.
image2: /assets/project_photos/planning-and-forecasting-2.png
challenges: The most challenging part of developing this feature was its integration with the current *brew run system*. Brew runs are composed from of a series of CosmosDB Documents. Namely, the core brew run details, turn details, fermentation details, conditioning details and packaging details. All together they represent the data of one full beer production. Normally, these details were created dynamically through the process of completing a brew run. With the integration of the planner, these details were pre-populated. This resulted in a series of cascading refactors because the original system was not originally designed with that in mind. This taught me a lot about the system but also a hard lesson in systems integration. Further, I implemented a complex conflict detection and resolution mechanism to automaticaly re-schedual brews.
image3: /assets/project_photos/planning-and-forecasting-3.png
technologies:
  - name: "Angular"
    image: "https://arweave.net/cEKMXNRVQelD16HFG_O7dgDAY_3L_8TaGkH7S2Y9RkI"
  - name: "Azure"
    image: "https://arweave.net/KzQTH9Ad-q3SFIjiY81KS5n7wvjFv7_2AczU0Ol9IT4"
  - name: "Typescript"
    image: "https://arweave.net/RZ97XLLlv_LzMyy5zV0f_zEB6XajCZAarLA1QlCiiEA"
  - name: "C#"
    image: "https://arweave.net/YgsGFbjkXXZX3UFfi3xjjQHaetX33qlobHwMTai83s4"
  - name: "Digital Ocean"
    image: "https://arweave.net/_RdXbJkbuM5lMfvEBMNqy2Fy1981W3UQMZv5hg9kbog"
  - name: "MSSQL"
    image: "https://arweave.net/VvSD0vuK-fQeifHqTZZLVQAAz9cKNmQ-tZOb53k1zg4"
  - name: "Azure Active Directory"
    image: "https://arweave.net/IiV7wYL8uimmRi-4QyT9VwNAvqk2MDk_w5aYWN_x9o0"
  - name: ".NET Core"
    image: "https://arweave.net/2OEbRffInEVfcLN1TzntSs5C0do2b-EMnqjm2sT365s"
URL: "https://app.brewersinsight.com/"
ENSURL: ""
githubURL: ""
startDate: 2024-01-01T12:13:10.205Z
endDate: 2024-01-01T12:13:10.205Z
status: complete
keywords: BrewersInsight, Brewer's Insight, Planner and Forecasting, Planning and Forecasting, brew planner, material forecasting, brewing production planning, beer production management, brewery materials management, brew run integration, Gantt chart brew planner, forecasting material shortages, angular brewing app, CosmosDB brew system, brewing solutions, systems integration brewing, Devin Davis
---
