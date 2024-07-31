const express = require('express');
// Creates an instance of the Express application. This app variable will be used to define routes and configure the server
const app = express();
const port = 3000;
 
// Defines a route for the root URL (/). When a client makes a GET request to the root URL,
// the server responds with the message "Hello World!"
app.get('/', (req, res) => {
res.send('Hello, World!');
});
 
// Start the server
app.listen(port, () => {
console.log(`Server is running at http://localhost:${port}`);
});