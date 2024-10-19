// controllers/userController.js
const User = require('../models/User');
//const Chat = require('../models/Chat');
//const Message = require('../models/Message');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password, gender } = req.body;

  let pic = gender === 'Female'
    ? 'https://icon-library.com/images/young-person-icon/young-person-icon-29.jpg'
    : 'https://icon-library.com/images/young-person-icon/young-person-icon-3.jpg';
    
  try {
    const newUser = new User({ firstName, lastName, email, password,pic: pic.trim(), gender });

    await newUser.save();
    res.redirect('/login')
  } catch (error) {
    if (error.code === 11000) {
      res.send('User already registered with this email. Please <a href="/login">login</a>.');
    } else {
      console.error('Error registering user:', error);
      res.send('Error registering user: ' + error.message);
    }
  }
};

// Login logic
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (user) {
      // Set the user session on successful login
      req.session.userId = user._id; // Store user ID in session
      res.redirect('/meeting'); // Redirect to the main page after login
    } else {
      res.send('Invalid email or password. Please try again or <a href="/">register</a>.');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.send('Error logging in: ' + error.message);
  }
};


// Fetch all users (for chatbox)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
};

// Fetch a user by ID and get their messages
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');

    // Mock messages for now
    const userdata = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      pic: user.pic,
    };

    res.json(userdata);
  } catch (err) {
    res.status(500).send('Error retrieving user');
  }
};


// Fetch a user by ID and get their messages
// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).send('User not found');

//     // Mock messages for now
//     const userWithMessages = {
//       _id: user._id,
//       name: user.name,
//       pic: user.pic,
//       messages: [
//         { text: 'Hi, how are you?', isSender: false, time: '16:30' },
//         { text: 'I am good, thanks!', isSender: true, time: '16:35' }
//       ]
//     };

//     res.json(userWithMessages);
//   } catch (err) {
//     res.status(500).send('Error retrieving user');
//   }
// };


// exports.getUserById = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Find the chat where the user is a participant
//     const chat = await Chat.findOne({
//       participants: { $in: [req.params.id] }
//     }).populate({
//       path: 'latestMessage',
//       model: 'Message',
//       populate: {
//         path: 'senderId',
//         model: 'User',
//         select: 'firstName lastName'
//       }
//     });

//     // If chat exists, find messages for that chat
//     let messages = [];
//     if (chat) {
//       messages = await Message.find({ chatId: chat._id })
//         .populate('senderId', 'firstName lastName')
//         .sort({ createdAt: 1 }); // Sort messages in ascending order by time
//     }

//     // Send the user details with messages
//     res.json({
//       _id: user._id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       pic: user.pic,
//       messages
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Error retrieving user or messages' });
//   }
// };

// // Search for users by name or email and return the last message
// exports.searchUsers = async (req, res) => {
//   try {
//     const query = req.query.query.trim();
    
//     if (query.length > 0) {
//       // Find users where the first name matches the search query
//       const users = await User.find({
//         firstName: { $regex: query, $options: 'i' } // Case-insensitive search
//       }).select('firstName lastName pic'); // Return only necessary fields

//       // Array to store users along with their last message
//       const usersWithLastMessage = [];

//       // Loop through the found users to find the latest message for each user
//       for (const user of users) {
//         // Find the chat where the current user is a participant and fetch the latest message
//         const chat = await Chat.findOne({
//           participants: user._id
//         }).populate('latestMessage'); // Populate the latest message from the Message model

//         // Get the last message's content if available
//         const lastMessage = chat?.latestMessage?.content || 'No messages yet';

//         // Add the user details along with the last message to the result array
//         usersWithLastMessage.push({
//           _id: user._id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           pic: user.pic,
//           lastMessage: lastMessage
//         });
//       }

//       // Return users with their latest message
//       res.json(usersWithLastMessage);
//     } else {
//       // If the query is empty, return an empty array
//       res.json([]);
//     }
//   } catch (error) {
//     console.error('Error searching users:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

