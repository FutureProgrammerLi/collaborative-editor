const express = require("express");
const cors = require("cors");
const ws = require("ws");
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new ws.Server({ server });

let document = '';

wss.on("connection", (connection) => {
    console.log("New connection");
    connection.send(JSON.stringify({ type: "init", data: document }));

    connection.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.type === "update") {
                document = parsedMessage.data;
                wss.clients.forEach((client) => {
                    if (connection.readyState === ws.OPEN) {
                        client.send(JSON.stringify({ type: "update", data: document }));
                    }
                });
            }
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    });
});

wss.on('close', () => {
    console.log('Connection closed');
});


const PORT = 5000;
server.listen(PORT, () => {
    console.log('Server is running on port 5000');
});
