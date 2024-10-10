const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Initialize the Express app
const app = express();
const port = 3000;


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

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



async function generateResponse() {
    return "Hello"
}