//Declarations
var express = require('express'),
    lunches = require('./routes/talktomongo'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

//Configure app
app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':80');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }
);
app.use(express.static(__dirname + '/public'));

//Actually show the server
server.listen(80);
console.log("Server running at http://127.0.0.1:80/");

io.sockets.on('connection', function (socket) {
  console.log('Connected!');
  socket.on('login', function (data) {
    lunches.login(data);
  });
});
