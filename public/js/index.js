const socket = io();

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('disconnect', () => {
  console.log('Lost Connection!')
})