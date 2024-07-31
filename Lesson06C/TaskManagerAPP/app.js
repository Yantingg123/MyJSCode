const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/task', (req, res) => {
    res.render('taskDetails');
});

app.post('/task', (req, res) => {
    const { title, description, deadline, priority } = req.body;
    res.render('confirm', { title, description, deadline, priority });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req, res) => {
    const { name, email, contactNo, comments } = req.body;
    res.render('submitted', { name, email, contactNo, comments });
});

// Server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
