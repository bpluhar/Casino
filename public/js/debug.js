const socket = io();

const walletButton = document.getElementById("walletButton");
const walletModalCloseButton = document.getElementById("walletModalCloseButton");
const walletModal  = document.getElementById("walletModal");

const debugBtn = document.getElementById("debugBtn");

const coin = document.getElementById("coin");

const recentBetsBlock = document.getElementById("recentBetsBlock");

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

debugBtn.addEventListener('click', () => {
  socket.emit('debug');
})

socket.on('debug', (data) => {
  //console.log(data);
  let p         = document.createElement('p')
  let rankSpan  = document.createElement('span')
  let nameSpan  = document.createElement('span')
  let betSpan   = document.createElement('span')

  rankSpan.classList.add('has-text-weight-bold')

  switch (data[0]) {
    case "Novice":
      rankSpan.classList.add('has-text-primary')
      break;
    case "Advanced":
      rankSpan.classList.add('has-text-link')
      break;
    case "Pro":
      rankSpan.classList.add('has-text-warning')
      break;
    case "Insane":
      rankSpan.classList.add('has-text-success')
      break;
    case "God":
      rankSpan.classList.add('has-text-danger')
    default:
      break;
  }

  nameSpan.classList.add('has-text-weight-bold')
  betSpan.classList.add('has-text-weight-normal')

  rankSpan.textContent  = `[${data[0]}] `;
  nameSpan.textContent  = `${data[1]}: `
  betSpan.textContent   = `${data[2]}`;

  p.appendChild(rankSpan)
  p.appendChild(nameSpan)
  p.appendChild(betSpan)

  recentBetsBlock.insertBefore(p, recentBetsBlock.firstChild)

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

    //console.log('Random 256 bytes:', randomBytes);

    try {
      // Hash the random bytes using SHA-256
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', randomBytes);

      // Convert the hash buffer to a hexadecimal string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

      //console.log('SHA-256 Hash:', hashHex);
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