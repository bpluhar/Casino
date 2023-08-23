const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const crypto = require('crypto');

require('dotenv').config();

var terminal = require('terminal-kit').terminal;

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
  clientSendFile(res, "/index.html");
});

app.get('/home', (req, res) => {
  clientSendFile(res, "/index.html");
});

function clientSendFile(res, filename) {
  res.sendFile(__dirname + filename);
  //console.log(`Sending File: ${filename}`.yellow);
  terminal('Sending File: ').yellow(filename)('\n');
}

function getRandomInt(min, max) {       
  var byteArray = new Uint8Array(1);
  crypto.getRandomValues(byteArray);
  var range = max - min + 1;
  var max_range = 256;
  if (byteArray[0] >= Math.floor(max_range / range) * range)
    return getRandomInt(min, max);
  return min + (byteArray[0] % range);
}

const ranks     = ['Baby', 'Novice', 'Advanced', 'Pro', 'Insane', 'God'];
const names     = ['John', 'Mary', 'Peter', 'Susan', 'David', 'Elizabeth', 'Michael', 'Sarah', 'Richard', 'Jennifer'];
const greetings = ["Hello", "Hi", "Howdy", "Greetings", "Salutations", "Aloha", "Konnichiwa", "Buenos días", "Guten Tag", "Hola"];


io.on('connection', (socket) => {

  terminal.cyan('A user has connected\n');

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

  socket.on('debug', () => {

    for (let x = 0; x <= 100; x++) {
      let data = [ranks[getRandomInt(0, 5)], names[getRandomInt(0, 9)], greetings[getRandomInt(0, 9)]]
      io.emit('debug', data)
    }
    
  })

  socket.on('disconnect', () => {
    //console.log('A user disconnected'.brightRed);
    terminal.red('A User Disconnected!\n');
  });

  
});

server.listen(process.env.port, () => {
  terminal.white('Server listening on port: ').green(`${process.env.port}\n`);
});