---
title: Normalized Immutable State in REDUX
content: >-
  On the surface, the concept of immutable state seems simple and easy to
  comprehend. It is in its application where developers seem to struggle…


  I’ve had no trouble at all understanding what an immutable state is but as soon as I started trying to implement it, I tore my eyes out for a week attempting to apply it. I want to attempt to explain why an immutable state is hard to implement to help myself understand it but also help others comprehend it.


  To explain it, I’ll word it in three different sentences…


  1. *An immutable state is one that is never modified directly but impressed with changed values.*

  2. *An immutable state is one that is copied, changed then returned and it’s original contents are never changed directly.*

  3. *An immutable state is reproduced in its original form, changed and then returned.*


  Hopefully these three sentences have helped you understand the concept of immutability. For some it can be difficult to distinguish between a mutable and immutable state because conceptually they appear to be very similar. Once this is drilled into your noggin, it all comes down to implementing it.


  ## Redux and Normalization


  Normalization is the concept of flattening data and this comes with great performance increases because data is referenced directly and instantly rather than looped over. This is because normalized nested data is represented by ids which are later used to reference that data.


  In larger applications the implementation of normalized data becomes critical, because large amounts of data need to be sifted through to find specific documents. A great example of this would be posts on a social media platform like Facebook. Posts inside these platforms, contain a great amount of specific data. This data may include, comments, user info and post info etc. If this data is composed in JSON format it can be incredibly time consuming for a program to lookup nested data because that data is stored directly and is not referenced. For instance, in a post there is comments and inside comments there are user ids for each poster, and sometimes comments on comments. Obviously, looking up nested data through looping is redundant if normalized data is used. The shear speed of looking up data directly is pleasing because the client side can react to those changes by reloading a single peace of data.


  ## **Normalizing Data**


  There are a few NPM repositories that make the process of normalization much easier. One being “normalizr” which takes JSON data and converts it into normalized data.


  ### Processed JSON DATA


  ```json

  [
     {
      posterId: "1",
      id: "1",
      title: "title 1",
      content: "This is some content.",
      comments: [
         {
          posterId: "1234",
          id: "1",
          content: "This is some comment content"
         },
         {
          posterId: "4321",
          id: "2",
          content: "This is some comment content"
         }
      ]
  },
    {
     posterId: "1",
     id: "2",
     title: "title 2",
     content: "This is some more content.",
     comments: [
        {
         posterId: "1234",
         id: "1",
         content: "This is some more comment content"
        },
        {
          posterId: "4321",
          id: "2",
          content: "This is some more comment content"
         }
      ]
  }

  ]

  ```


  ### Normalized Data


  ```json

  {
     entities: {
         posts: {
            1 : {
                 posterId: "1",
                 title: "title 1",
                 content: "This is some content.",
                 comments: [1, 2],
            },
            2 : {
                 posterId: "1",
                 title: "title 2",
                 content: "This is some content.",
                 comments: [1, 2]
     }
  },
      comments: {
           1: {
               posterId: "1234",
               content: "This is some comment content"
           },
           2: {
               posterId: "4321",
               content: "This is some comment content"
           }
       }
     }
  }

  ```


  Alright so lets break these down. In the first column of code there is processed JSON data which is an array of objects containing their respectful sets of data. In the second contains a set of processed normalized data which has been process with the Normalizr npm package. The key difference between the two sets of data is that content is separated based on their titles. Through the use of Normlizr’s schema modeling, users can define how their data is structured into its normalized counterpart. In this case, a “post schema” and “comments schema” were defined and the comments schema was nested inside the post schema. This way normlizr knows when it receives post data that it needs to pull out all the comments inside each post and turn them into its own object. It then takes the ids of each comment and places them inside the corresponding post’s comments array. This way when a post requires the content of a comment all it needs to do is compare the ids inside its comments array with those stored inside the comments array. This can seem quite complicated at first but conceptually it makes sense. It all comes down to working with relational based data by looking up ids rather than having to loop through large amounts of data just to find a single document.


  Since creating and consuming API’s can be quite difficult when attempting to use normalized data, I’ve included some resources which may help with the journey. Please take the time to read through documentation because it really explains exactly what you need to do to be successful with you project.


  ## **RESOURCES:**


  **Redux’s normalized data docs:** <https://redux.js.org/recipes/structuring-reducers/normalizing-state-shape>


  **Normalizr NPM package:** <https://www.npmjs.com/package/normalizr>


  If you work with mongoose here is a **JSON normalizer plugin** for your schemas: <https://github.com/meanie/mongoose-to-json>


  **Helpful videos:**


  [*Normalize Data and Redux:* https://www.youtube.com/watch?v=YvRDgLEY6sE](https://www.youtube.com/watch?v=YvRDgLEY6sE)


  *The Best Way to Store Data:* <https://www.youtube.com/watch?v=aJxcVidE0I0>
thumnail: /assets/0_5klgzawxicimkg4h.jpg
date: 2020-02-21T15:59:17.824Z
keywords: "redux, immutable, normalization, react, javascript, json, npm, "
---
