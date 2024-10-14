const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
require('dotenv').config()


// Initialize the Express app
const app = express();
const port = 3000;

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

app.use(express.static('client'));

// Set up storage for uploaded files using Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '/uploads/');
        // Ensure the upload path directory exists
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Use the original file name
        cb(null, file.originalname);
    }
});

// Set up file filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Create a Multer instance with the storage engine and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

// Define a route for file uploads
app.post('/upload-pdf', upload.single('pdfFile'), (req, res) => {
    if (req.file) {
        res.send("PDF uploaded successfully!");
    } else {
        res.status(400).send("No PDF file uploaded.");
    }
});

app.get('/generate-response', async (req, res) => {
    const haiku = await generateResponse();
    res.send(haiku);
});


//! testing zone


// Function to add a random number to the database
async function addRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 100);
    try {
        const client = await pool.connect()
        const result = await client.query(
            'INSERT INTO random_numbers (number) VALUES ($1) RETURNING *',
            [randomNumber]
        );
        client.release();
        return result.rows[0];
    } catch (error) {
        console.error('Error adding random number to database', err);
        throw err;
    }
}

// New route to add a random number to the database
app.get('/add-random-number', async (req, res) => {
    try {
        const result = await addRandomNumber();
        res.json({ message: 'Random number added successfully', number: result.number })
    } catch (error) {
        res.status(500).json({ error: 'Failed to add random number' });
    }
})





//! end of testing zone

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



async function generateResponse() {
    return "Hello"
}