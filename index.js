console.time("Time to Start")
require('dotenv').config()

const express   = require('express')
const http      = require('http')
const socketIO  = require('socket.io')
const app       = express()
const server    = http.createServer(app)
const io        = socketIO(server)
const crypto    = require('crypto')
const safe      = require('safe-rng')
var terminal    = require('terminal-kit').terminal
const figlet    = require('figlet')
const gradient  = require('gradient-string')

const viewsFolder = "/public/views";

app.get('/', (req, res) => {
  clientSendFile(res, `index.html`);
});

app.get('/home', (req, res) => {
  clientSendFile(res, `index.html`);
});

app.get('/coinflip', (req, res) => {
  clientSendFile(res, `coinflip.html`);
});

app.get('/debug', (req, res) => {
  clientSendFile(res, `debug.html`)
 });

const rank = ['Novice', 'Advanced', 'Pro', 'Insane', 'God'];
const name = ['John', 'Emily', 'Michael', 'Sarah', 'David', 'Jessica', 'Daniel', 'Jennifer', 'Christopher', 'Linda'];
const msg = "Hello, I'm ";

var houseWinnings = 0;
var playerWinnings = 0;

io.on('connection', (socket) => {

  updateConsoleView();

  socket.on('debug', () => {
    // DEBUG //
    
    for (i = 0; i < 5000; i++) {
      let data = [];
      let serverSeed = safe.sha256(safe.generateServerSeed());
      data[0] = rank[safe.generateInteger("asidh289uq4h", serverSeed, process.env.nonce, 0, 4)];
      data[1] = name[safe.generateInteger(123, serverSeed, process.env.nonce, 0, 9)];
      data[2] = msg + data[1];
      socket.emit('debug', data);
    } 
  });

  socket.on('flipTurd', (clientSeed) => {
    /*
        Need to add functionality of sending bet amount
        and changing users balance in database depending
        on the outcome of the game. If player wins then
        add winnings to playerWinnings, if house wins then
        add winnings to houseWinnings to be displayed in
        server console accordingly.
    */
    
    let serverSeed = safe.sha256(safe.generateServerSeed());
    let bool = safe.generateBool(clientSeed, serverSeed, process.env.nonce);
    let handover = {"clientSeed": clientSeed, "serverSeed": serverSeed, "res": bool};
    setTimeout(function() {
      socket.emit('flipTurd', handover);
    }, 333)
    
    updateConsoleView();
  });

  socket.on('disconnect', () => {
    //console.log('A user disconnected'.brightRed);
    //terminal.red('A User Disconnected!\n');
  });
  
});

server.listen(process.env.port, () => {
  //console.clear();
});

///////////////
// FUNCTIONS //
///////////////

/*
    This function ideally shoudn't be ran every
    time its called or when communication
    between the sockets is completed. Instead
    it should be in a setTimeout() of roughly
    every 30 seconds to occassionally pull
    the latest data.

    Nothing related to winnings or losses is to
    be tracked and stored locally on the NodeJS
    server. Instead all actions are done in the
    database, where it is then pulled and stored
    in a variable for use of displaying in the 
    server console window. 
*/
function updateConsoleView() {
  console.clear();
  figlet.text(
    "POOP CASINO",
    {
      font: "big",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    },
    function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      console.log(gradient.atlas(data));
    }
  );

  setTimeout(function() {
    console.log(gradient.vice(`   > Connected Users: ${io.engine.clientsCount}`));
    console.log(gradient.vice(`   > House Winnings: ${houseWinnings}`));
    console.log(gradient.vice(`   > Player Winnings: ${playerWinnings}`));
  }, 250)
}

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function clientSendFile(res, filename) {
  res.sendFile(__dirname + viewsFolder + '/' + filename);
  //console.log(`Sending File: ${filename}`.yellow);
  //terminal('Sending File: ').yellow(filename)('\n');
}