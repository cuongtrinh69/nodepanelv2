const socket = io();

// Cập nhật thông số VPS (Uptime, CPU, RAM, Disk)
socket.on('stats', (data) => {
  document.getElementById('uptime').innerText = data.uptime + 's';
  document.getElementById('cpu').innerText = data.cpu + '%';
  document.getElementById('ram').innerText = data.ram + '%';
  document.getElementById('disk').innerText = data.disk + '%';
});

// Điều khiển các tab (Log, Code, Terminal)
document.getElementById('logTabBtn').addEventListener('click', () => {
  showTab('log');
});
document.getElementById('codeTabBtn').addEventListener('click', () => {
  showTab('code');
});
document.getElementById('terminalTabBtn').addEventListener('click', () => {
  showTab('terminal');
});

// Hàm hiển thị tab tương ứng
function showTab(tabName) {
  document.getElementById('logTab').style.display = (tabName === 'log') ? 'block' : 'none';
  document.getElementById('codeTab').style.display = (tabName === 'code') ? 'block' : 'none';
  document.getElementById('terminalTab').style.display = (tabName === 'terminal') ? 'block' : 'none';
}

// Xử lý nút Start/Stop (nếu bạn đã làm sẵn socket emit thì thêm ở đây)
document.getElementById('startBtn').addEventListener('click', () => {
  const cmd = document.getElementById('commandInput').value;
  socket.emit('start', cmd);
});

document.getElementById('stopBtn').addEventListener('click', () => {
  socket.emit('stop');
});
