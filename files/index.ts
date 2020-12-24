import express from "express";
import http from "http";
import shell from "shelljs";
const socketio = require("socket.io");

const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true,
    },
});

io.on("connection", (socket: any) => {
    socket.on("run", (data: any) => {
        console.log(`Run ${data}`);
        let child = shell.exec(`./run.sh ${data}`, {
            async: true,
            silent: true,
        });
        child.stdout.on("data", function (data) {
            socket.emit("result", data);
        });
    });
});

server.listen(port, () => {
    console.log("Server is up on port " + port);
});
