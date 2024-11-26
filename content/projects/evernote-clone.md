---
title: Evernote Clone
description: I started this desktop application while attending the [Nova Scotia
  Community College](https://www.nscc.ca/) as part of my Electron course. I
  decided to do a partial clone of the desktop version of
  [Evernote](https://evernote.com/).
image1: "https://arweave.net/7f1HrXPLRLhG_IEuLK5hqfvVop2hQC0GV0YzXRBOGY4"
tech: Our course had us use Electron to build desktop-grade applications with JavaScript, HTML, and CSS. The advantage here is that web developers like myself are able to produce desktop applications without needing to change their language context. I went a step further and implemented a simple state management system from scratch so that various actions could have "side effects" like disabling the create note button when a notebook is not selected. Frameworks like React enable this kind of functionality but I wanted to learn what was going on under the hood.
image2: "https://arweave.net/n-Zm5I5kzTK8Uootup0mFb6tmsS7-hMBEj1VZNf_3gY"
challenges: The main challenges I faced were while implementing the state management system. State management involves the use of a few different consepts most notably, a store, mutations, and actions. The store contains the current state of the application. For instance the create note button can be disabled or enabled depending on a certain state value. Actions call mutations which are functions that change or "mutate" the store. Therefore, actions simply call mutations and should not do any mutating themselves. The store's contents represent the current state of the application. It's an advanced consept that I still don't completly understand on a technicle level but I managed to implement a simple solution.
image3: "https://arweave.net/favOipp10Vy6nnOwk293X4ar89c7_Sw32hX32V4Pfic"
technologies:
  - name: "Electron"
    image: "https://arweave.net/Rvk45znM88OD1WtsBFgrb_RvaeHute80Fmkk4Dj5Z4s"
  - name: "SQLite"
    image: "https://arweave.net/lIndmxHck3IQfrwcpyrwhgCiT51hA3haAVEyRe2o96c"
URL: ""
ENSURL: ""
githubURL: "https://github.com/barnacleDevelopments/EvernoteClone"
startDate: 2021-12-13T20:10:21.522Z
endDate: 2021-12-13T20:10:21.522Z
status: complete
keywords: evernote desktop clone, electron desktop app, electron evernote clone, state management in electron, javascript desktop apps, note-taking app clone, sqlite database electron app, electron state management, custom state management system, web developer desktop app, portfolio project electron, nova scotia community college project, javascript state management from scratch
---
