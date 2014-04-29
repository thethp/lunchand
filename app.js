//Declarations
var express = require('express'),
    lunches = require('./routes/talktomongo'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//Configure app
app.use(express.static(__dirname + '/public'));

//Actually show the server
server.listen(80);
console.log("Server running at http://127.0.0.1:80/");

io.sockets.on('connection', function (socket) {
  console.log('Connected!');
  socket.on('bar', function (data) {
    console.log(data);
  });
});
