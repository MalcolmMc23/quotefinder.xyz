const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config()
const bcrypt = require('bcrypt')



// Function to normalize email addresses (specifically for Gmail)
function normalizeEmail(email) {
    const [localPart, domain] = email.split('@');
    if (domain.toLowerCase() === 'gmail.com' || domain.toLowerCase() === 'googlemail.com') {
        return (localPart.replace(/\./g, '') + '@' + domain).toLowerCase();
    }
    return email.toLowerCase(); // Return the original email in lowercase if not Gmail
}


// Initialize the Express app
const app = express();
const port = 3000;

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

// Add this line to use the built-in JSON parser
app.use(express.json()); // This will parse JSON bodies

// Middleware for sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Use a secure secret
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        httpOnly: true,
        sameSite: 'lax' // Adjust based on your setup
    }
}));

// Initialize Passport after session middleware
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    // callbackURL: "http://localhost:3000/auth/google/callback"
}, async (req, accessToken, refreshToken, profile, done) => {
    let client;
    try {
        client = await pool.connect();

        // Check if the user already exists in the database
        const result = await client.query('SELECT * FROM users WHERE google_id = $1', [profile.id]);
        let user = result.rows[0];

        if (!user) {
            // If user does not exist, insert a new user
            const insertResult = await client.query(
                'INSERT INTO users (google_id, name, email) VALUES ($1, $2, $3) RETURNING *',
                [profile.id, profile.displayName, normalizeEmail(profile.emails[0].value)]
            );
            user = insertResult.rows[0]; // Newly created user
        }

        // Set the session user ID
        // req.session.userId = user.id; // This should work if req.session is defined'
        // console.log(req.session.userId)
        return done(null, user); // Pass the user object to Passport
    } catch (error) {
        console.error('Error during Google OAuth strategy:', error);
        return done(error);
    } finally {
        if (client) {
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


app.get('/auth/google', (req, res, next) => {
    console.log('Google OAuth route hit');
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, set the session user ID
    req.session.userId = req.user.id; // Set the session user ID
    res.redirect('/profile'); // Redirect to the profile page
});

app.get('/error', (req, res) => {
    res.status(500).send('Authentication failed. Please try again.');
});



app.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Normalize the email before using it in queries
    const normalizedEmail = normalizeEmail(email);

    let client; // Declare client here for scope
    try {
        client = await pool.connect();

        // Query for user using normalized email
        const result = await client.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
        let user = result.rows[0];

        if (user) {
            // Check if the user is associated with a Google account
            if (user.google_id) {
                return res.status(403).json({ error: 'This email is associated with a Google account. Please log in using Google.' });
            }

            // Ensure the password field exists in the user object
            if (user.password_hash) {
                // If the user exists and is not associated with Google, verify the password
                const isMatch = await bcrypt.compare(password, user.password_hash);
                if (isMatch) {
                    req.session.userId = user.id; // Create a session
                    return res.status(200).json({ message: 'Login successful' });
                } else {
                    return res.status(401).json({ error: 'Invalid email or password.' });
                }
            } else {
                return res.status(401).json({ error: 'Password not found for this user.' });
            }
        } else {
            // If user does not exist, create a new user with a hashed password
            const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
            const insertResult = await client.query(
                'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *',
                [normalizedEmail, hashedPassword]
            );
            user = insertResult.rows[0]; // Newly created user
            req.session.userId = user.id; // Create a session
            return res.status(201).json({ message: 'User created and logged in successfully' });
        }

    } catch (error) {
        console.error('Error during login:', error); // Log the error
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (client) {
            client.release(); // Ensure the client is released
        }
    }
});




// Logout route
app.get('/logout', (req, res, next) => {
    // Passport's logout method
    req.logout(err => {
        if (err) {
            return next(err);
        }

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
            }
            // Redirect the user to the homepage or login page
            res.redirect('/');
        });
    });
});



function isAuthenticated(req, res, next) {
    if (req.isAuthenticated() || req.session.userId) { // Check if user is authenticated or has a session
        return next();
    }
    res.redirect('/'); // Redirect to home if not authenticated
}

app.get('/profile', isAuthenticated, async (req, res) => {
    // Check if user data is available in the session
    console.log(req.user)
    if (!req.user) {
        // If req.user is not available, fetch user data from the database using req.session.userId
        const userId = req.session.userId;
        if (userId) {
            const client = await pool.connect(); // Get a client from the pool
            try {
                const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
                const user = result.rows[0];
                if (user) {
                    // Render the profile page with user data
                    res.sendFile(path.join(__dirname, 'client', 'profile/profile.html'));
                } else {
                    res.redirect('/'); // Redirect if user not found
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                res.status(500).send('Internal Server Error');
            } finally {
                client.release(); // Ensure the client is released in the finally block
            }
        } else {
            console.log("no user id");
            res.redirect('/'); // Redirect if no user ID in session
        }
    } else {
        // If req.user is available, render the profile page
        res.sendFile(path.join(__dirname, 'client', 'profile/profile.html'));
    }
});

// Serve user data as JSON for the client-side JavaScript to fetch
app.get('/api/profile', isAuthenticated, async (req, res) => {
    const userId = req.session.userId; // Get user ID from session
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];
        if (user) {
            res.json({ user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
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





// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});























/* DONT DELETE
this is for granting access to the api service



// grantUserAccess(1);

// Function to update user's "has_access" to true
async function grantUserAccess(userId) {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(
            'UPDATE users SET has_access = $1 WHERE id = $2 RETURNING *',
            [true, userId]
        );

        if (result.rowCount === 0) {
            console.log(`User with ID ${userId} not found`);
            return { error: 'User not found' };
        }

        return result.rows[0]; // Return updated user data
    } catch (error) {
        console.error('Error updating user access:', error);
        return { error: 'Internal server error' };
    } finally {
        if (client) {
            client.release();
        }
    }
}


*/
