const http = require('http');
const express = require('express');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: {
		origin: "https://robot-socket.herokuapp.com"||"http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})

app.use(cors());
app.use(router);


io.on('connect', (socket) => {
  socket.emit("me", socket.id)

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded")
  })

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  })

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal)
  })
  // socket.emit("me", socket.id)
  //
  //
  // socket.on("callUser", (data) => {
  //   io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
  // })
  //
  // socket.on("answerCall", (data) => {
  //   io.to(data.to).emit("callAccepted", data.signal)
  // })
  //
  //
  //
  // socket.on('join', ({ name, room }, callback) => {
  //   const { error, user } = addUser({ id: socket.id, name, room });
  //
  //   if (error) return callback(error);
  //
  //   socket.join(user.room);
  //
  //   socket.emit('message', {
  //     user: 'admin',
  //     text: `${user.name}, welcome to room ${user.room}.`
  //   });
  //   socket.broadcast
  //     .to(user.room)
  //     .emit('message', { user: 'admin', text: `${user.name} has joined!` });
  //
  //   io.to(user.room).emit('roomData', {
  //     room: user.room,
  //     users: getUsersInRoom(user.room)
  //   });
  //
  //   callback();
  // });
  //
  // socket.on('sendMessage', (message, callback) => {
  //   const user = getUser(socket.id);
  //
  //   io.to(user.room).emit('message', { user: user.name, text: message });
  //   io.to(user.room).emit('roomData', {
  //     room: user.room,
  //     users: getUsersInRoom(user.room)
  //   });
  //
  //   callback();
  // });
  //
  // socket.on('disconnect', () => {
  //   const user = removeUser(socket.id);
  //   socket.broadcast.emit("callEnded")
  //
  //   if (user) {
  //     io.to(user.room).emit('message', {
  //       user: 'Admin',
  //       text: `${user.name} has left.`
  //     });
  //     io.to(user.room).emit('roomData', {
  //       room: user.room,
  //       users: getUsersInRoom(user.room)
  //     });
  //   }
  // });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
