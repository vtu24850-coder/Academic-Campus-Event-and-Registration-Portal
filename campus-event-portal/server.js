const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Home Page - Show Events
app.get('/', (req, res) => {
    db.query("SELECT * FROM events", (err, results) => {
        res.render('index', { events: results });
    });
});

// Show Registration Page
app.get('/register/:id', (req, res) => {
    const eventId = req.params.id;

    db.query("SELECT * FROM events WHERE event_id = ?", 
    [eventId], 
    (err, result) => {
        res.render('register', { event: result[0] });
    });
});
// Student Registration
app.post('/register', (req, res) => {
    const { name, email, event_id } = req.body;

    db.query("INSERT INTO users (name, email, role) VALUES (?, ?, 'student')",
        [name, email], (err, result) => {

        const userId = result.insertId;

        db.query("INSERT INTO registrations (user_id, event_id) VALUES (?, ?)",
            [userId, event_id], () => {
                res.send("Successfully Registered!");
            });
    });
});


// Admin Page
app.get('/admin', (req, res) => {
    db.query("SELECT * FROM events", (err, results) => {
        res.render('admin', { events: results });
    });
});


// Add Event
app.post('/add-event', (req, res) => {
    const { title, description, date, venue, capacity } = req.body;

    db.query(
        "INSERT INTO events (title, description, date, venue, capacity) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, venue, capacity],
        () => {
            res.redirect('/admin');
        }
    );
});


app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});