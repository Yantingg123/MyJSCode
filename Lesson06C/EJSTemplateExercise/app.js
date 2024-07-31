// Import required modules
const express = require('express');
const bodyParser = require('body-parser');

// Create an Express application
const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

//Define a route to render the index page
app.get('/', (req, res) => {
    res.render('index', 
    {
        // Activity 1: Add code to include another variable “age” to be passed to the index.ejs page
        name : 'Peter',
        age : '15'
    });
});

//Define a route to render the contact us page
app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/submit', (req, res) => {
    // Render the submit page for GET requests
    res.render('submitted', { 
        name: '',
        email: '',
        contact: '',
        comments: ''
    });
});

app.post('/submit', (req, res) => {
    // Handle form submission logic here
    const { name, email, contact, comments } = req.body;
    // Render the submitted page with the form data received
    res.render('submitted', { 
        name: name,
        email: email,
        contact: contact,
        comments: comments
    });
});



// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});