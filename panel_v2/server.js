const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const osu = require('node-os-utils');  // Thư viện lấy CPU, RAM, Disk
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // static folder chứa html/css/js

io.on('connection', (socket) => {
  console.log('A user connected');

  // Gửi stats liên tục
  setInterval(async () => {
    const uptime = osu.os.uptime(); // uptime in seconds
    const cpu = await osu.cpu.usage(); // CPU usage %
    const memInfo = await osu.mem.info(); // RAM info
    const diskInfo = await osu.drive.info(); // Disk info

    socket.emit('stats', {
      uptime,
      cpu,
      ram: (100 - memInfo.freeMemPercentage).toFixed(2),
      disk: diskInfo.usedPercentage
    });
  }, 2000); // 2s gửi 1 lần

  // Nhận command từ Terminal để chạy
  socket.on('runCommand', (cmd) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        socket.emit('terminalOutput', `Error: ${error.message}`);
        return;
      }
      if (stderr) {
        socket.emit('terminalOutput', `Stderr: ${stderr}`);
        return;
      }
      socket.emit('terminalOutput', stdout);
    });
  });

  // Khi người dùng yêu cầu lấy danh sách file (cho Code tab)
  socket.on('getFileList', () => {
    const folderPath = './'; // hoặc './public' nếu bạn muốn chỉ đọc file web
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        socket.emit('fileList', []);
        return;
      }
      const allowedFiles = files.filter(file =>
        file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css')
      );
      socket.emit('fileList', allowedFiles);
    });
  });

  // Khi người dùng yêu cầu đọc nội dung file
  socket.on('readFile', (filename) => {
    const filePath = path.join('./', filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        socket.emit('fileContent', { filename, content: 'Error reading file' });
        return;
      }
      socket.emit('fileContent', { filename, content: data });
    });
  });
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://0.0.0.0:3000');
});
