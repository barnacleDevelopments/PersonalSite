---
id: 2
title: MyBoards
description: >-
  This is a fun passion project I started when I was attending college. It was
  an app that allowed climbers to track their hangboard workout progress. The
  main feature of the app was the ability to add any hangboard they owned to the
  interface which could be used to create workouts. 


  The user could then create workouts with various sets and repetitions. They would be able to select which holds on the board they would like to use for each set. Later, when they selected the workout they wanted to perform they would see their hangboard with the highlighted holds they selected that would change on each set.
image1: /assets/screenshot_2022-12-16-17-20-43-74_18ebc393c906127f3e74bc0d996301a3.jpg
tech: I built the application using React Native for the front-end client and a
  C# - ASP.NET api for the blackened. I never deployed the application to the
  public but I wanted to experience the start-to-end deployment process, so I
  learned how to deploy the blackened app on a Digital Ocean Droplet. Also, I
  used a Digital Ocean database instance to host a Postgress database.
image2: /assets/screenshot_2022-12-16-17-21-18-83_18ebc393c906127f3e74bc0d996301a3.jpg
challenges: >-
  The most challenging part of the developing this application was the add
  hangboard interface. It needed to map coordinates to a image that could scale
  in any direction X - Y. Also, depending on the device used the image would
  scale proportionate to it's screen. 


  The authentication/authorization mechanism also changed while I was developing. I originally developed it to authenticate with Azure Active Directory but that wasn't a great user experience because they would need a Microsoft account to authenticate so I switched it to [ASP.NET core custom Authentication](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/?view=aspnetcore-7.0).
image3: /assets/screenshot_2022-12-16-17-35-41-72_18ebc393c906127f3e74bc0d996301a3.jpg
overLink: https://github.com/barnacleDevelopments/MyBoards
date: 2022-01-01T14:54:06.484Z
completeTime: 400
keywords: hangboards, app
---
