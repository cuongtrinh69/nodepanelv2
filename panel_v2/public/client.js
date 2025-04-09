const socket = io();

const output = document.getElementById('output');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const commandInput = document.getElementById('commandInput');

startBtn.onclick = () => {
  const command = commandInput.value.trim();
  if (command) {
    socket.emit('start', { command });
  }
};

stopBtn.onclick = () => {
  socket.emit('stop');
};

socket.on('output', (data) => {
  output.innerHTML += `<div>${data}</div>`;
  output.scrollTop = output.scrollHeight;
});
