// app.js
 
const concatenateStrings = require('./modules/stringHandler');
 
const string1 = 'Hello, ';
const string2 = 'Node.js!';
 
const concatenatedString = concatenateStrings(string1, string2);
 
console.log('String 1:', string1);
console.log('String 2:', string2);
console.log('Concatenated String:', concatenatedString);
