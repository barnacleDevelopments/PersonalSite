---
title: MyBoards
description: This is a fun passion project I started when I was attending college. It was an app that allowed climbers to track their hangboard workout progress. The main feature of the app was the ability to add any hangboard they owned to the interface which could be used to create workouts. The user could then create workouts with various sets and repetitions. They would be able to select which holds on the board they would like to use for each set. Later, when they selected the workout they wanted to perform they would see their hangboard with the highlighted holds they selected that would change on each set.
image1: assets/myboards-1.jpg
tech: I built the application using React Native for the front-end client and a C# - ASP.NET api for the blackened. I never deployed the application to the public but I wanted to experience the start-to-end deployment process, so I learned how to deploy the blackened app on a Digital Ocean Droplet. Also, I used a Digital Ocean database instance to host a Postgress database.
image2: assets/myboards-2.jpg
challenges: The most challenging part of the developing this application was the add hangboard interface. It needed to map coordinates to a image that could scale in any direction X - Y. Also, depending on the device used the image would scale proportionate to it's screen. The authentication/authorization mechanism also changed while I was developing. I originally developed it to authenticate with Azure Active Directory but that wasn't a great user experience because they would need a Microsoft account to authenticate so I switched it to [ASP.NET core custom Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-7.0).
image3: assets/myboards-3.jpg
URL: ""
ENSURL: ""
githubURL: https://github.com/barnacleDevelopments/MyBoards
technologies:
  - name: "Digital Ocean"
    image: "../tech_logos/digital-ocean.png"
  - name: "React Native"
    image: "../tech_logos/react-native.png"
  - name: "PostgreSQL"
    image: "../tech_logos/postgresql.png"
startDate: 2022-01-01T14:54:06.484Z
endDate: 2022-01-01T14:54:06.484Z
status: complete
keywords: hangboard workout tracking app, climbers workout app, react native hangboard app, c# asp.net api workout app, digital ocean deployment, scalable image interface react native, custom authentication asp.net core, postgresql database for workout apps, azure active directory authentication, typescript workout app, entity framework core api, mssql database for fitness apps, workout app with custom hangboards, Devin Davis
---
