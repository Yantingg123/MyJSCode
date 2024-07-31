// Import the Express. js framework
const express = require('express');
// Create an instance of the Express application. This app variable will be used to define routes and configure the server
const app = express();
// Specify the port for the server to listen on
const port = 3002;

// Middleware for JSON parsing
app.use(express.json());

// In-memory data for students
let students = [
    { id: 1, name: 'Peter Tan', age: 20 },
    { id: 2, name: 'Mary Lim', age: 22 },
    { id: 3, name: 'John Ho', age: 21 }
];

// Routes for CRUD operations
app.get('/students', function (req, res) { //get http method
    // Respond with the list of students in JSON format
    res.json(students);
});

// Route to get a specific student by ID
// Handling a GET request to the '/students/:id' endpoint using Express.js
app.get('/students/:id', function (req, res) {
    // Extracting the 'id' parameter from the request parameters and converting it to an integer
    const studentId = parseInt(req.params.id);
    // Searching for a student in the 'students' array with a matching 'id'
    const student = students.find((student) => student.id === studentId);

    // Checking if a student with the specified 'id' was found
    if (student) {
        // Responding with JSON containing the details of the found student
        res.json(student);
    } else {
        // Responding with a 404 status code and JSON message if the student is not found
        res.status(404).json({ message: 'Student not found' });

    }
});

// Add a new student
app.post('/students', function (req, res) {
    const newStudent = req.body;
    // Assign a new ID to the student
    newStudent.id = students[students.length - 1].id + 1;
    // Add the new student to the array
    students.push(newStudent);
    // Respond with the newly created student in JSON format
    res.status(201).json(newStudent);
});

// Update a student
app.put('/students/:id', function (req, res) {
    const studentId = parseInt(req.params.id);
    const updatedStudent = req.body;

    // Update the students array
    students = students.map(function (student) {
        //Checks if the current student has the same ID as the student being updated.
        if (student.id === studentId) {
            // If there is a match, this line creates a new object using the spread ( ... ) operator to merge
            // the existing student data ( ... student) with the updated data ( ... updatedStudent).
            // This ensures that the updated fields overwrite the existing fields while keeping the rest
            // of the properties intact.
            return { ...student, ...updatedStudent };
        }
        //if there is no match, it returns the current student unchanged.
        return student;

    });

    // Respond with the updated student in JSON format
    res.json(updatedStudent);
});

// Delete a student by ID
app.delete('/students/:id', function (req, res) {
    const studentId = parseInt(req.params.id);

    // Filter out the deleted student
    students = students.filter(student => student.id !== studentId);
    // Respond with a success message in JSON format
    res.json({ message: 'Student deleted successfully' });
});

app.get('/', function (req, res) {
    res.send('Welcome to the student API. Use /students to get a list of all students.');
});

// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully started
    console.log(`Server is running at http://localhost:${port}`);
});