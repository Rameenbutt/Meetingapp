const stream = (socket) => {
  
  // socket.on('joinRoom', (roomId, stream) => {
  //   console.log(`User ${socket.id} is joining room: ${roomId}`);

  //   // Join the specified room
  //   socket.join(roomId);

  //   // Notify other users in the room about the new user
  //   socket.to(roomId).emit('userJoined', socket.id);

  //   // Listen for when the user disconnects
  //   socket.on('disconnect', () => {
  //       console.log(`User ${socket.id} disconnected from room ${roomId}`);
  //       socket.to(roomId).emit('userLeft', socket.id);
  //   });
  // });

  socket.on('join-room', (roomId, userId, userStream) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
    
    // Broadcast to other users that a new user has connected
    socket.to(roomId).emit('user-connected', userStream);

    // When the user leaves the room
    socket.on('user-left', () => {
        socket.to(roomId).emit('user-left', userId);
        console.log(`User ${userId} left room ${roomId}`);
    });

    // Handle user disconnect (e.g., page closed)
    socket.on('disconnect', () => {
        socket.to(roomId).emit('user-left', userId);
    });
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
