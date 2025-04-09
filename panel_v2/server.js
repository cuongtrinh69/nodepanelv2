const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const osu = require('node-os-utils');  // <- thư viện lấy CPU, RAM, Disk

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // nếu có public html

io.on('connection', (socket) => {
  console.log('A user connected');

  setInterval(async () => {
    const uptime = osu.os.uptime(); // uptime in seconds
    const cpu = await osu.cpu.usage(); // CPU usage %
    const memInfo = await osu.mem.info(); // RAM info
    const diskInfo = await osu.drive.info(); // Disk info

    socket.emit('stats', {
      uptime,
      cpu,
      ram: 100 - memInfo.freeMemPercentage,
      disk: diskInfo.usedPercentage
    });
  }, 2000); // cứ 2s gửi 1 lần
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:3000');
});
