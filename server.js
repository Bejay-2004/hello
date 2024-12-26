require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
const PORT = process.env.PORT || 3000; // Render uses the PORT environment variable

// Basic middleware setup
app.use(cors());

app.use(cors({
  origin: 'https://bejay-2004.github.io/the-final/'
}));

app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set to true if using HTTPS
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Middleware to serve static files (css, js, images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from root directory EXCEPT index.html
app.use(express.static(__dirname, {
    index: false  // Prevent serving index.html automatically
}));

// Database Configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'sql12.freemysqlhosting.net',
    user: process.env.DB_USER || 'sql12754290',
    password: process.env.DB_PASSWORD || 'jkYhCI3483',
    database: process.env.DB_NAME || 'sql12754290',
    port: process.env.DB_PORT || 3306
});

// Database Connection
db.connect((err) => {
    if (err) {
        console.error('Could not connect to the database:', err);
        return;
    }
    console.log('Connected to the database');
    
    // Create posts table if it doesn't exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
            post_id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            category VARCHAR(100) NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES belly(user_id)
        )
    `;
    
    db.query(createTableQuery, (err) => {
        if (err) {
            console.error('Error creating posts table:', err);
            return;
        }
        console.log('Posts table ready');
    });
});

// Root route - redirect based on auth status
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/index.html');
    } else {
        res.sendFile(path.join(__dirname, 'login.html'));
    }
});

// Protect index.html
app.get('/index.html', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both username and password' });
    }

    const query = 'SELECT * FROM belly WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            const user = results[0];

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    return res.status(500).json({ success: false, message: 'Error comparing password' });
                }

                if (isMatch) {
                    req.session.user = { 
                        userId: user.user_id, 
                        username: user.username 
                    };
                    res.json({ success: true, message: 'Login successful', redirectUrl: '/login.html' });
                } else {
                    res.status(401).json({ success: false, message: 'Invalid login credentials' });
                }
            });
        } else {
            res.status(401).json({ success: false, message: 'User not found' });
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error logging out' });
        }
        res.redirect('/login.html');
    });
});

// Get user route
app.get('/get-user', requireAuth, (req, res) => {
    res.status(200).json({
        success: true,
        username: req.session.user.username,
        userId: req.session.user.userId
    });
});

// Registration route
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Please provide both username and password' });
    }

    const checkQuery = 'SELECT * FROM belly WHERE username = ?';
    db.query(checkQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Error hashing password' });
            }

            const userId = Math.floor(100000 + Math.random() * 900000);
            const query = 'INSERT INTO belly (user_id, username, password) VALUES (?, ?, ?)';
            
            db.query(query, [userId, username, hashedPassword], (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
                }
                res.json({ success: true, message: 'Registration successful', userId: userId });
            });
        });
    });
});

// Post creation route
app.post('/create-post', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'You must be logged in to create a post' });
    }

    const { category, content } = req.body;
    const userId = req.session.user.userId;

    if (!category || !content) {
        return res.status(400).json({ success: false, message: 'Category and content are required' });
    }

    const query = 'INSERT INTO posts (user_id, category, content) VALUES (?, ?, ?)';
    db.query(query, [userId, category, content], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error', error: err.message });
        }
        res.json({ success: true, message: 'Post created successfully', postId: results.insertId });
    });
});

// Get posts route
app.get('/get-posts', (req, res) => {
    const userId = req.session.user?.userId;

    if (!userId) {
        return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const query = `
        SELECT 
            p.user_id,
            p.Content as content,
            p.CreatedAt as createdAt,
            p.category,
            b.username
        FROM posts p
        JOIN belly b ON p.user_id = b.user_id
        WHERE p.user_id = ?
        ORDER BY p.CreatedAt DESC
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Error fetching posts' });
        }

        const formattedPosts = results.map(post => ({
            ...post,
            createdAt: new Date(post.createdAt).toISOString()
        }));
        res.json({ success: true, posts: formattedPosts });
    });
});

// Admin login route
app.post('/admin/login', (req, res) => {
    const { admin_name, admin_password } = req.body;

    if (!admin_name || !admin_password) {
        return res.status(400).json({ success: false, message: 'Please provide both admin name and password' });
    }

    const query = 'SELECT * FROM admins WHERE admin_name = ?';
    db.query(query, [admin_name], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length > 0 && admin_password === results[0].admin_password) {
            res.json({ success: true, redirectUrl: 'admin.html' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

// Get all contacts route
app.get('/api/get-all-contacts', (req, res) => {
    const query = 'SELECT * FROM belly';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Error fetching data' });
        }
        res.json({ users: result });
    });
});

// Admin Endpoint to get all contacts from the 'belly' table
app.get('/api/get-all-contacts', (req, res) => {
    const query = 'SELECT * FROM belly';
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching data');
        }
        res.json({ users: result });
    });
});

// Optional: Endpoint for filtering users
app.get('/api/filter-users', (req, res) => {
    const { search, userType, registrationDate } = req.query;
    let query = 'SELECT * FROM belly WHERE 1=1';

    if (search) {
        query += ` AND (name LIKE '%${search}%' OR email LIKE '%${search}%')`;
    }
    if (userType) {
        query += ` AND user_type = '${userType}'`;
    }
    if (registrationDate) {
        query += ` AND registration_date = '${registrationDate}'`;
    }

    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send('Error fetching data');
        }
        res.json({ users: result });
    });
});

// Update user route
app.post('/update-user', (req, res) => {
    const { user_id, username } = req.body;
    const query = 'UPDATE belly SET username = ? WHERE user_id = ?';

    db.query(query, [username, user_id], (err, result) => {
        if (err) {
            console.error("Error updating user:", err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Delete user route
app.delete('/delete-user', (req, res) => {
    const { user_id } = req.body;
    const query = 'DELETE FROM belly WHERE user_id = ?';

    db.query(query, [user_id], (err, result) => {
        if (err) {
            console.error("Error deleting user:", err);
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});

// Route to fetch posts data
app.get('/api/posts', (req, res) => {
    const query = 'SELECT user_id, category, Content FROM posts'; // Added 'content'
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results); // Send results to the frontend
    });
});

// Endpoint to fetch posts from the database
app.get('/api/posts', (req, res) => {
    const query = `
      SELECT posts.content, posts.category, posts.user_id
      FROM posts
      ORDER BY posts.created_at DESC
    `;
  
    db.query(query, (err, results) => {
      if (err) throw err;
      res.json(results); // Send the posts with the user_id to the frontend
    });
});

// Create an API endpoint to get the total number of users
app.get('/api/totalUsers', (req, res) => {
    const query = 'SELECT COUNT(*) AS user_id FROM belly'; // Replace 'users' with your actual table name

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching total users:', err.stack);
            return res.status(500).json({ error: 'Database query error' });
        }

        // Assuming the result is an array with one object containing the total_users count
        const totalUsers = results[0].total_users;
        res.json(totalUsers);  // Send the total number of users as the response
    });
});
  
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});