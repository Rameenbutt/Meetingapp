const stream = (socket) => {
  
  // Join a specific meeting room
  socket.on('joinMeeting', (data) => {
    const { roomId } = data;
    
    // Join the socket to the meeting room
    socket.join(roomId);
    console.log(`User joined meeting room: ${roomId}`);

    // Emit a welcome message to the user who joined
    socket.emit('message', 'Welcome to the meeting room!');

    // Notify the room about the new user joining
    socket.to(roomId).emit('message', 'A new user has joined the meeting!');
  });

  // Handle WebRTC signaling
  socket.on('offer', (data) => {
    const { offer, roomId } = data;
    socket.to(roomId).emit('offer', offer);
  });

  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('user-left', socket.id);  // Notify others that this user has left
  });


  socket.on('answer', (data) => {
    const { answer, roomId } = data;
    socket.to(roomId).emit('answer', answer);
  });

  socket.on('iceCandidate', (data) => {
    const { candidate, roomId } = data;
    socket.to(roomId).emit('iceCandidate', candidate);
  });

  // Handle chat messages
  socket.on('chatMessage', (data) => {
    const { roomId, message, senderName } = data;
    socket.to(roomId).emit('message', { message, senderName });
  });

  // Handle sending messages to a meeting room
  // socket.on('chatMessage', ({ roomId, message }) => {
  //   socket.to(roomId).emit('message', message);
  // });
};

module.exports = stream;
