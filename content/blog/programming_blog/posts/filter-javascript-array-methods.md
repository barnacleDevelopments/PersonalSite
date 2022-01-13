---
title: " Filter - JavaScript Array Methods"
content: >-
  Sometimes filtering is a useful tool. Brewing coffee is a great example of
  filtering. Depending on how you like your coffee you may choose a paper
  filter. This filter is then used to keep grinds out of your coffee. Just like
  our paper filter, the JavaScript filter method is used to filter out un-wanted
  data. 


  The .filter method is useful when when we want to “filter” out certain elements from an array to get only the ones needed. 


  .filter() is a method that iterates over an array much like the .forEach method does. It applies a function to each element and removes those that don’t return as positive values. For instance, take the array bellow, it contains years ranging from 1700 to 2000.


  ```javascript

  var years[1980, 1878, 1943, 1734, 1793];

  ```


  To “filter out” all the numbers under a certain year we can use the .filter method. To do this we need to specify what array we want to iterate over and apply the .filter method to it like so:


  ```javascript

  years.filter();

  ```


  The .filter() method takes a function as an argument between the two parenthesizes. This function will take a name as an argument which will represent each individual element inside the array. In this case we will use the word “year”.


  ```javascript

  years.filter(function(year) {


  });

  ```


  Now we must specify through the function which elements should be kept and which should be removed. For this example we will keep all elements between the years 1800 and 2000. To do this we will use a simple if statement.


  ```javascript

  years.filter(function(year) {
    if(year > 1800);
      return true
    }); 


    
  // output: [1980, 1878, 1943];

  ```


  When the screen reader passes over the years.filter() it will return all the elements that are above the year 1800. The function will only print out the years where they evaluate to be true after passing through the “if” statement. Otherwise, they are removed. Keep in mind that the returned results are compiled into a completely new array.


  To simplify this we could adjust the syntax by creating an arrow function, removing the if statement and changing the function’s statements.


  ```javascript

  years.filter((year) => {year > 1800});

  // output: [1980, 1878, 1943];

  ```


  The function contained inside the filter method will evaluate to be true just the same.
thumnail: /assets/photo-1514927298007-a2b56e5270e1.jpg
date: 2019-11-09T16:24:53.076Z
keywords: javascript, filter, array, arrays, javascript arrays, methods,
  javascript methods
---
