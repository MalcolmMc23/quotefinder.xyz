const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config()


// Initialize the Express app
const app = express();
const port = 3000;

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Middleware for sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Make sure this is a secure, long secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Set this to true if you're using HTTPS
        httpOnly: true,
        sameSite: 'lax' // Adjust based on your setup
    }
}));


// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Google profile:', profile);  // Add this to see the profile returned
    let client;  // Declare client here to ensure it's in scope
    try {
        client = await pool.connect();  // Connect to the database

        // Check if the user already exists in the database
        const result = await client.query(
            'SELECT * FROM users WHERE google_id = $1',
            [profile.id]
        );
        let user = result.rows[0];

        if (!user) {
            // If user does not exist, insert a new user with a timestamp
            const insertResult = await client.query(
                'INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *',
                [profile.id, profile.displayName, profile.emails[0].value]
            );
            user = insertResult.rows[0];  // This will include the created_at timestamp
        }

        return done(null, user);  // Pass the user object to Passport
    } catch (error) {
        console.error('Error during Google OAuth strategy:', error);  // Log the error
        return done(error);  // Pass the error back to Passport
    } finally {
        if (client) {  // Ensure client is defined before calling release
            client.release();
        }
    }
}));
passport.serializeUser((user, done) => {
    done(null, user.id);  // Serialize user ID to session
});

passport.deserializeUser(async (id, done) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
        client.release();
        done(null, result.rows[0]);  // Attach user object to request
    } catch (error) {
        done(error);
    }
});




app.use(express.static('client'));


app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    req.session.save(() => {
        res.redirect('/profile');  // Redirect to profile page after successful login
    });
});

app.get('/error', (req, res) => {
    res.status(500).send('Authentication failed. Please try again.');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

app.get('/profile', isAuthenticated, (req, res) => {
    res.json({ user: req.user });
});


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
    const randomNumber = Math.floor(Math.random() * 100);  // Generate a random number
    try {
        const client = await pool.connect();  // Get a client from the connection pool
        const result = await client.query(
            'INSERT INTO random_numbers (number) VALUES ($1) RETURNING *',
            [randomNumber]
        );
        client.release();  // Release the client back to the pool
        return result.rows[0];  // Return the inserted row
    } catch (error) {  // Catch and log the error (change err to error)
        console.error('Error adding random number to database:', error);
        throw error;  // Re-throw the error to propagate it to the caller
    }
}

// New route to add a random number to the database
app.get('/add-random-number', async (req, res) => {
    try {
        const result = await addRandomNumber();
        res.json({ message: 'Random number added successfully', number: result.number });
    } catch (error) {
        console.error('Error adding random number:', error);  // Log the actual error
        res.status(500).json({ error: 'Failed to add random number' });
    }
});





//! end of testing zone

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



async function generateResponse() {
    return "Hello"
}