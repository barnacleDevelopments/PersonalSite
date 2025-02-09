---
title: Web3 Providers and the Argument for Pre-Installed Wallets
thumbnail: assets/logo_2.png
date: 2020-04-03T15:13:45.129Z
keywords: providers, web3, wallets
category: web3
draft: true
---

_To pre-face this article. The intended audience is for developers and newcomers to blockchain. It is intented to provide general and technical information to help new commerse and developer alike._

If you are reading this article you are probably interested in blockchain and have a basic understanding it works. If you are new to blockchain and are interested in learning more about them I'd recommend this article I wrote [].

There is no denying that if you explain the benefits of consensus to a typical person they would be like "that sounds like a good idea!" Then you'd go about explaining the user experience and you'd hit a road block. This is because there are a lot of steps involved in interacting with blockchain networks. Its obvious that blockchain networks are complicated and improvements need to be made in the user experience and devlopment domains. This article will explain how typical users interact with blockchain networks and will identify some of the usability issues they face.

## The Authentication Problem

To unserstand the authentication mechanism of blockchain networks you basically need to ditch the idea of authenticated user sessions. They don't exist. To read and write against a blockchain network you need capital, in the form of crypto currency, and private keys. A typical user flow would look like this:

1. Transaction Initiation.
2. Accept networks fees and determine the amount of crypto to send.
3. Transaction Signing (with private key).
4. Transaction Broadcasting (can take some time).
5. Then everything else irrelevent to a typical user.

Then compare this to a client / server model

1. Login
2. Do a thing
3. Log out

There is a clear usability issue here. It's complicated and time consuming to perform actions on chain. I believe there is a place for both centralized and decentralized applications but I also believe that the user experiences should be pleasant to help with user adoption.

## The Payment Problem

To authenticate actions against a blockchain users need to have private keys.

## Solutions

So what are we to do about this ease of access issue? Well to start having each of these browsers pre-install at least a basic and functional wallet would be a good start but currently I think a lot of the organizations running these browsers have no intentions of doing so any time soon. I think a possible solution to this problem would be to introduce wallet functionality into extensions people already know and love. I'm thinking password managers would be the ideal candidate. Last pass and 1Password are both great options.
