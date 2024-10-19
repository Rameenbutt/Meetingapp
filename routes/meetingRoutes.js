const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

// Schedule a meeting
router.post('/schedule', meetingController.scheduleMeeting);

// Get meetings
router.get('/get-meetings', meetingController.getMeetings);

// Get meetings for calendar
router.get('/calendarmeetings', meetingController.getCalendarMeetings);

module.exports = router;
