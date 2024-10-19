const Meeting = require('../models/Meeting');
const { v4: uuidv4 } = require('uuid'); // To generate unique room IDs

// Schedule a meeting
exports.scheduleMeeting = async (req, res) => {
  try {
    const { title, date, time, agenda } = req.body;
    const meetingDate = new Date(date);
    
    // Create a unique room ID for this meeting
    const roomId = uuidv4();

    const newMeeting = new Meeting({
      title,
      date: meetingDate,
      time,
      agenda,
      roomId // Store the generated room ID
    });

    await newMeeting.save();

    // // Create a notification
    // const notification = new Notification({
    //   userId: 'user-id-placeholder', // Replace with actual user ID
    //   message: `A new meeting titled "${title}" has been scheduled.`,
    //   type: 'meeting',
    //   status: 'unread',
    //   isStarred: false,
    //   priority: 'medium',
    //   isImportant: false,
    //   link: `/meeting/${newMeeting._id}`
    // });
    // await notification.save();

    res.status(201).json({ message: 'Meeting created successfully', roomId }); // Include room ID in response
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    res.status(500).json({ message: 'Failed to schedule meeting' });
  }
};

// Fetch all meetings
exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find();
    res.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch meetings for calendar
exports.getCalendarMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({});
    const calendarEvents = meetings.map(meeting => ({
      title: meeting.title,
      start: meeting.date,
      time: meeting.time,
      description: meeting.agenda,
      roomId: meeting.roomId // Include roomId for calendar use if needed
    }));
    res.json(calendarEvents);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    res.status(500).send('Error fetching meetings');
  }
};
