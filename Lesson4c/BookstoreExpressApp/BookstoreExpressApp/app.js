// Import the Express.js framework
const express = require('express');
// Create an instance of the Express application. This 'app' variable will be used to define routes and configure the server
const app = express();
// Specify the port for the server to listen on
const port = 3001;

// Middleware for JSON parsing
app.use(express.json());

// In-memory data for books
let books = [
    { id: 1, title: 'Think Again', author: 'Adam Grant', price: 41.50 },
    { id: 2, title: 'Think Faster, Talk Smarter', author: 'Matt Abrahams', price: 22.50 },
    { id: 3, title: 'Algorithmic Thinking', author: 'Daniel Zingaro', price: 43.50 }
];

// Route handler to retrieve and display all the books
app.get('/books', function(req, res) {
    res.json(books);
});

// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully started
    console.log(`Server is running at http://localhost:${port}/books`);
});
