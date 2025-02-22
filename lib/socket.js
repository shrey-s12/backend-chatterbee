const dotenv = require('dotenv');
dotenv.config();

const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const CLIENT_URL = process.env.CLIENT_URL

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: CLIENT_URL,
        credentials: true
    }
});

// use to store online users
const userSocketMap = {} // { userId: socketId }

io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    // io.emit() is used to send event to all connected clients
    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        console.log('A user disconnected', socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { io, app, server }