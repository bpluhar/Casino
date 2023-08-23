const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('dotenv').config();

var colors = require('colors');

function ifThrow(error) {
  if (error) throw error;
};

function loadLast(res) {
    let x = 0;

    while (x < res.length) {
      io.emit('chat message', res[x].chat_msg); // Respond with next row in line
      x++;
    }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); 
});



io.on('connection', (socket) => {

  console.log('A user connected'.brightCyan);

  // on 'chat message' from client to server
  socket.on('chat message', (msg) => {

    if (msg === "showTest") {

    }

    if (msg === "testAdd") {
      let x = 0;

      while (x < 1001) {
        conn.query("INSERT INTO `chat_history` (`chat_id`, `timestamp`, `chat_msg`, `chat_author`) VALUES (NULL, current_timestamp(), 'test message', '?')", [x], function(error, results, fields) {
          ifThrow(error);
          console.log("INSERT Entry!");
        });
        x++;
      };

    }

    // Reflect back to other clients
    io.emit('chat message', msg); 
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected'.brightRed);
  });

  socket.on('client_startTyping', () => {
    console.log("User is Typing!");
  });

  socket.on('client_stopTyping', () => {
    console.log("User stopped typing!");
  });
  
});

server.listen(process.env.port, () => {
  console.log(`Server listening on *:${process.env.port}`);
});