<script src="/socket.io/socket.io.js"></script>
<script>
  const socket = io();

  socket.on('stats', (data) => {
    document.getElementById('uptime').innerText = data.uptime + 's';
    document.getElementById('cpu').innerText = data.cpu + '%';
    document.getElementById('ram').innerText = data.ram + '%';
    document.getElementById('disk').innerText = data.disk + '%';
  });
</script>

<table>
  <tr>
    <td>Uptime</td><td id="uptime">...</td>
  </tr>
  <tr>
    <td>CPU</td><td id="cpu">...</td>
  </tr>
  <tr>
    <td>RAM</td><td id="ram">...</td>
  </tr>
  <tr>
    <td>Disk</td><td id="disk">...</td>
  </tr>
</table>
