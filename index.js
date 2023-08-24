const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const crypto = require('crypto');
const safe = require('safe-rng');

var terminal = require('terminal-kit').terminal;

require('dotenv').config();

app.get('/', (req, res) => {
  clientSendFile(res, "/public/index.html");
});

app.get('/home', (req, res) => {
  clientSendFile(res, "/public/index.html");
});

app.get('/coinflip', (req, res) => {
  clientSendFile(res, "/public/coinflip.html");
});

function clientSendFile(res, filename) {
  res.sendFile(__dirname + filename);
  //console.log(`Sending File: ${filename}`.yellow);
  terminal('Sending File: ').yellow(filename)('\n');
}

io.on('connection', (socket) => {

  terminal.cyan('A user has connected\n');

  socket.on('debug', () => {
    
  });

  socket.on('flipTurd', (clientSeed) => {
    let serverSeed = safe.sha256(safe.generateServerSeed());
    terminal('Server Seed: ').yellow(serverSeed)('\n');
    terminal('Client Seed: ').yellow(clientSeed)('\n');
    let bool = safe.generateBool(clientSeed, serverSeed, process.env.nonce);

    let handover = {"clientSeed": clientSeed, "serverSeed": serverSeed, "res": bool};

    setTimeout(function() {
      socket.emit('flipTurd', handover);
    }, 2000)

  });

  socket.on('disconnect', () => {
    //console.log('A user disconnected'.brightRed);
    terminal.red('A User Disconnected!\n');
  });

  
});

server.listen(process.env.port, () => {
  terminal.white('Server listening on port: ').green(`${process.env.port}\n`);
});

///////////////
// FUNCTIONS //
///////////////

function ifThrow(error) {
  if (error) throw error;
}

function loadLast(res) {
    let x = 0;

    while (x < res.length) {
      io.emit('chat message', res[x].chat_msg); // Respond with next row in line
      x++;
    }
}