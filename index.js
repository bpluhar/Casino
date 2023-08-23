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
    // Create byte array and fill with 1 random number
    var byteArray = new Uint8Array(1);
    crypto.getRandomValues(byteArray);

    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
      return getRandomInt(min, max);
    return min + (byteArray[0] % range);
  }

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
    let start = Date.now();

    count = 10001;

    for (let x = 0; x < count; x++) {
      //let rng = getRandomInt(0, 100);
      io.emit('debug', x);
    };
    let delta = Date.now() - start;
    terminal(`Took `).green(delta)('ms to generate and emit ').green(count - 1)(' numbers to all ').green(io.engine.clientsCount)(' sockets.\n');
  })

  socket.on('disconnect', () => {
    //console.log('A user disconnected'.brightRed);
    terminal.red('A User Disconnected!\n');
  });

  
});

server.listen(process.env.port, () => {
  terminal.white('Server listening on port: ').green(`${process.env.port}\n`);
});