const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const mysql = require('mysql');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chat_log'
});

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

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/chat.html'); 
});

io.on('connection', (socket) => {

  console.log('A user connected');

  // Pull past messages

  

  conn.query("SELECT * FROM `chat_history` ORDER BY `chat_id` ASC LIMIT 0, 10", function(error, results, fields) {
    ifThrow(error);
    //console.log(results);
    if (results.length == 0) return;
    loadLast(results);
  });

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

      console.log("added 1000");

    }
    


    io.emit('chat message', msg); // Reflect back to other clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  
});

server.listen(3000, () => {
  console.log('Server listening on *:3000');
});