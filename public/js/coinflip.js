const socket = io();

const walletButton = document.getElementById("walletButton")
const walletModalCloseButton = document.getElementById("walletModalCloseButton")
const walletModal  = document.getElementById("walletModal")

const debugBetTrackerButton = document.getElementById("debugBetTrackerButton")

const coin = document.getElementById("coin")

const currentSessionBox = document.getElementById("currentSessionBox")

const flipTurdButton = document.getElementById("flipTurdButton")

const rngPromise = new Promise(generateClientSeed);

document.addEventListener('DOMContentLoaded', () => {
  (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
    const $notification = $delete.parentNode;

    $delete.addEventListener('click', () => {
      $notification.parentNode.removeChild($notification);
    });
  });
});

debugBetTrackerButton.addEventListener('click', () => {
  console.log(`Truths: ${trues.length}`)
  console.log(`Falses: ${falses.length}`)
})

flipTurdButton.addEventListener('click', () => {

  generateClientSeed().then(clientSeed => {
    if (clientSeed !== null) {
      //console.log('Server Seed:', clientSeed); // Use the hashHex value here
      flipTurdButton.classList.add('is-loading')
      socket.emit('flipTurd', clientSeed);
    } else {
      console.log('Failed to generate and hash.');
    }
  });

  //socket.emit('flipTurd', clientSeed);
})

// data['serverSeed']
// data['clientSeed']
// data['res']

var trues  = [];
var falses = [];

// flipTurd received back from server, show results
socket.on('flipTurd', (data) => {

  flipTurdButton.classList.remove('is-loading')
  if (data['res']) {
    coin.classList.add('coinTrue');
    addToSessionBlock(data);
    trues.push(true)
    setTimeout(function() {
      coin.classList.remove('coinTrue')
    }, 2000);
  } else {
    coin.classList.add('coinFalse');
    addToSessionBlock(data);
    falses.push(false)
    setTimeout(function() {
      coin.classList.remove('coinFalse')
    }, 2000);
  }

})

walletModalCloseButton.addEventListener('click', () => {
  walletModal.classList.remove('is-active');
})

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('disconnect', () => {
  console.log('Lost Connection!')
})

///////////////
// Functions //
///////////////

async function generateClientSeed() {
  if (window.crypto && window.crypto.getRandomValues) {
    const numBytes = 256;
    const randomBytes = new Uint8Array(numBytes);
    window.crypto.getRandomValues(randomBytes);

    try {
      // Hash the random bytes using SHA-512
      const hashBuffer = await window.crypto.subtle.digest('SHA-512', randomBytes);

      // Convert the hash buffer to a hexadecimal string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

      return hashHex; // Return the hashHex value
    } catch (error) {
      console.error('Error hashing:', error);
      return null; // Return null if there's an error
    }
  } else {
    console.error('crypto.getRandomValues() is not supported in this browser.');
    return null; // Return null if crypto.getRandomValues is not available
  }
}

// data = "clientSeed": clientSeed, "serverSeed": serverSeed, "res": bool}; 
function addToSessionBlock(data) {

  let htmlArray = [];
  

  let p               = document.createElement('p')
  let hr              = document.createElement('hr')

  let timeSpan        = document.createElement('span')
  let transIdSpan     = document.createElement('span')
  let serverSeedSpan  = document.createElement('span')
  let clientSeedSpan  = document.createElement('span')
  let betSpan         = document.createElement('span')
  let changeSpan      = document.createElement('span')

  htmlArray.push(timeSpan, transIdSpan, serverSeedSpan, clientSeedSpan, betSpan, changeSpan)

  let time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  if (data['res']) {
    // True/Heads
    htmlArray.forEach((item) => {
      item.classList.add('has-text-primary')
      item.classList.add('button')
    });
    changeSpan.textContent  = `+${Math.floor(Math.random() * 1000)}`
  } else if (!data['res']) {
    htmlArray.forEach((item) => {
      item.classList.add('has-text-danger')
      item.classList.add('button')
    });
    changeSpan.textContent  = `-${Math.floor(Math.random() * 1000)}`
  }

  htmlArray[0].textContent        = time
  htmlArray[1].textContent        = "Transaction: 01234567"
  htmlArray[2].textContent        = data['serverSeed'].substring(0, 9)
  htmlArray[3].textContent        = data['clientSeed'].substring(0, 9)
  htmlArray[4].textContent        = `Bet: ${Math.floor(Math.random() * 1000)}`

  htmlArray.forEach((item) => {
    p.appendChild(item)
  })

  p.appendChild(hr);

  currentSessionBox.insertBefore(p, currentSessionBox.firstChild)

}