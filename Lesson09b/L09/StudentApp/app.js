const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const moment = require('moment');

const app = express();

// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentlistapp'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Set up view engine
app.set('view engine', 'ejs');

// Enable static files
app.use(express.static('public'));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Enable form processing
app.use(express.urlencoded({ extended: true }));

// [R] Display All Students
app.get("/", (req, res) => {
    const sql = "SELECT * FROM `name`";
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return res.status(500).send("Error retrieving students");
        }
        res.render('index', { students: results });
    });
});

// [R] Display ONE student from table
app.get('/student/:id', (req, res) => {
    const prodId = req.params.id;
    const sql = "SELECT * FROM students WHERE studentid = ?;";
    connection.query(sql, [prodId], (error, results) => {
        if (error) {
            console.error("Database query error:", error.message);
            return res.status(500).send("Error retrieving students by Id");
        }
        if (results.length > 0) {
            res.render('student', { student: results[0] });
        } else {
            res.status(404).send("Student not found");
        }
    });
});

// [C] Add student - Display blank form
app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});

// [C] Add student - After clicking save
app.post('/addStudent', upload.single('image'), (req, res) => {
    const { name, dob, contact } = req.body;
    const image = req.file ? req.file.filename : null;
    const sql = 'INSERT INTO students (name, dob, contact, image) VALUES (?, ?, ?, ?)';
    connection.query(sql, [name, dob, contact, image], (error, results) => {
        if (error) {
            console.error("Error adding student:", error);
            res.status(500).send('Error adding student');
        } else {
            res.redirect('/');
        }
    });
});

// [R] Get ONE student to be updated
app.get("/editStudent/:id", (req, res) => {
    const studentid = req.params.id;
    const sql = "SELECT * FROM students WHERE studentid = ?";
    connection.query(sql, [studentid], (error, results) => {
        if (error) {
            console.error("Database query error:", error.message);
            return res.status(500).send("Error retrieving student");
        }
        if (results.length > 0) {
            let formatedDob = moment(results[0].dob).format('YYYY-MM-DD');
            res.render("editStudent", { student: results[0], formatedDob: formatedDob });
        } else {
            res.render("editStudent", { student: null });
        }
    });
});

// [U] Update student - After pressing SAVE button
app.post("/editStudent/:id", upload.single('image'), (req, res) => {
    const studentid = req.params.id;
    const { name, dob, contact } = req.body;
    let image = req.body.currentImage;
    if (req.file) {
        image = req.file.filename;
    }
    const sql = "UPDATE students SET name = ?, dob = ?, contact = ?, image = ? WHERE studentid = ?";
    connection.query(sql, [name, dob, contact, image, studentid], (error, results) => {
        if (error) {
            console.error("Database query error:", error.message);
            return res.status(500).send("Error updating student");
        }
        res.redirect("/");
    });
});

// [D] Delete student
app.get("/deleteStudent/:id", (req, res) => {
    const studentid = req.params.id;
    const sql = "DELETE FROM students WHERE studentId = ?";
    connection.query(sql, [studentid], (error, results) => {
        if (error) {
            console.error("Database query error:", error.message);
            return res.status(500).send("Error deleting student");
        }
        res.redirect("/");
    });
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
