const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt'); // For password hashing
const { Pool } = require('pg');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
require('dotenv').config();

// Initialize the Express app
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));  // To parse form data
app.use(express.json());  // To parse JSON data

// PostgreSQL connection setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// Middleware for sessions
app.use(session({
    secret: process.env.SESSION_SECRET, // Make sure this is a secure, long secret
    resave: false,
    saveUninitialized: false,
    rolling: true,  // Reset cookie expiration on each request
    cookie: {
        secure: process.env.NODE_ENV === 'production',
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
    console.log('Google profile:', profile);
    let client;
    try {
        client = await pool.connect();

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
            user = insertResult.rows[0];
        }

        return done(null, user);
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
        done(null, result.rows[0]);
    } catch (error) {
        done(error);
    }
});

app.use(express.static('client'));

// Registration route (Email + Password)
app.post('/register', async (req, res) => {
    const { email, password, name } = req.body;
    const saltRounds = 10;

    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING *',
            [email, passwordHash, name]
        );

        req.login(newUser.rows[0], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.redirect('/profile');
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).send('Server error');
    }
});

// Login route (Email + Password)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the email is registered
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        if (!user) {
            console.log('Login failed: Email not found');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the password
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            console.log('Login failed: Invalid password');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Log the user in
        req.login(user, (err) => {
            if (err) {
                console.log('Login failed: Error during login session', err);
                return res.status(500).json({ message: 'Login failed. Please try again later.' });
            }
            console.log('Login successful for user:', user.email);
            return res.redirect('/profile'); // This can also be `res.json({ message: 'Login successful' })`
        });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Logout route
app.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.session.destroy((err) => {
            if (err) {
                console.log('Error destroying session:', err);
            }
            res.redirect('/');
        });
    });
});

// Ensure user is authenticated
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/google');
}

app.get('/profile', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'profile/profile.html'));
});

// Serve user data as JSON for the client-side JavaScript to fetch
app.get('/api/profile', isAuthenticated, (req, res) => {
    const user = {
        google_id: req.user.google_id,
        name: req.user.name,
        email: req.user.email,
        profile_picture: req.user.profile_picture || req.user.photos?.[0]?.value,
        created_at: req.user.created_at
    };
    res.json({ user });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});