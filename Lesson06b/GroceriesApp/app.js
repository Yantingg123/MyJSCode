const express = require('express');
const app = express();
const port = 3005;

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Sample data for snacks and dairy products
const snacksList = ['Chips', 'Cookies', 'Candy'];
const dairyList = ['Milk', 'Cheese', 'Yogurt'];

// Define a route to render the grocery list page
app.get('/', (req, res) => {
    res.render('groceries', { snacksList, dairyList });
});

// Start the server
const PORT = process.env. PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
