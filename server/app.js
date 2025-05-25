import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
}))

app.use('/', (req, res) => {
    res.send('hello World');
})
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
})

io.on('connection', (socket) => {
    console.log("User Connected", socket.id);
    socket.on('disconnect', () => {
        console.log("User Disconnected", socket.id);
    })
    socket.on("message", ({ message, room }) => {
        socket.to(room).emit("recieve-message", message);
        console.log(`Message from ${socket.id} in room ${room}:`, message);
    })
    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
    });


})

const port = 3000;
server.listen(port, () => {
    console.log('Server is running on port', port);
})