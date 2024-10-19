// routes/userRoutes.js
const express = require('express');
const {getUsers, registerUser, loginUser, getUserById} = require('../controllers/userController');
const router = express.Router();

// Registration route (POST request)
router.post('/register', registerUser);

// Login route (POST request)
router.post('/login', loginUser);

// GET route to fetch all users
router.get('/chatbox', getUsers);

// GET route to fetch a user by ID
router.get('/api/users/:id', getUserById);

// router.get('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.send('Error logging out');
//     }
//     res.redirect('/login'); // Redirect to login after logging out
//   });
// });

// router.get('/search', searchUsers);

module.exports = router;
