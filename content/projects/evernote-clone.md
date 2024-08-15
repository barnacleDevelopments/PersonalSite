---
thumbnail: /assets/logo_2.png
title: Evernote Clone
description: I started this desktop application while attending the [Nova Scotia
  Community College](https://www.nscc.ca/) as part of my Electron course. I
  decided to do a partial clone of the desktop version of
  [Evernote](https://evernote.com/).
image1: /assets/mainview.png
tech: >-
  Our course had us use Electron to build desktop-grade applications with
  JavaScript, HTML, and CSS. The advantage here is that web developers like
  myself are able to produce desktop applications without needing to change
  their language context. 


  I went a step further and implemented a simple state management system from scratch so that various actions could have "side effects" like disabling the create note button when a notebook is not selected. Frameworks like React enable this kind of functionality but I wanted to learn what was going on under the hood.
image2: /assets/menuview.png
challenges: >-
  The main challenges I faced were while implementing the state management
  system. State management involves the use of a few different consepts most
  notably, a store, mutations, and actions. The store contains the current state
  of the application. For instance the create note button can be disabled or
  enabled depending on a certain state value. 
  Actions call mutations which are functions that change or "mutate" the store. Therefore, actions simply call mutations and should not do any mutating themselves. The store's contents represent the current state of the application. It's an advanced consept that I still don't completly understand on a technicle level but I managed to implement a simple solution.
image3: /assets/expandedview.png
technologies:
  - name: "Electron"
    image: "/assets/tech_logos/electron.svg"
  - name: "SQLite"
    image: "/assets/tech_logos/sqlite.svg"
liveLink: ""
githubLink: "https://github.com/barnacleDevelopments/EvernoteClone"
startDate: 2021-12-13T20:10:21.522Z
endDate: 2021-12-13T20:10:21.522Z
completeTime: 20
status: complete
keywords: evernote, clone, project, demo, portfolio piece
---
