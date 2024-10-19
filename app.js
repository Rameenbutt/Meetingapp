const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const User = require('./models/User');
const session = require('express-session'); // Add session support
const MongoStore = require('connect-mongo'); // To store session in MongoDB
const bodyParser = require('body-parser');
const stream = require('./sockets/stream');
const socketIO = require('socket.io');
// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);


// Connect the socket with your stream logic
io.on('connection', stream);

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing application/json

// Session middleware
app.use(session({
  secret: 'your-secret-key', // Change this to something more secure
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Store sessions in MongoDB
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // Session expiration: 1 day
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next(); // Proceed if the user is logged in
  }
  res.redirect('/login'); // Redirect to login if not authenticated
}

// Routes
app.use(userRoutes);
app.use(meetingRoutes);


// Protect all the routes with authentication
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  // If already logged in, redirect to index
  if (req.session.userId) {
    return res.redirect('/meeting');
  }
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/meeting', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    console.log('Fetched User:', user);

    if (!user) {
      return res.status(404).send('User not found, please log in again.');
    }

    // Pass user data (including the user ID) to the static HTML file
    res.sendFile(path.join(__dirname, 'public', 'meeting.html')); // Adjust the path if necessary
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

app.get('/meet', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    console.log('Fetched User:', user);

    if (!user) {
      return res.status(404).send('User not found, please log in again.');
    }

    // Pass user data (including the user ID) to the static HTML file
    res.sendFile(path.join(__dirname, 'public', 'meet.html')); // Adjust the path if necessary
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

app.get('/user-data', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.json(user); // Send user data as JSON
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('An error occurred: ' + error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
