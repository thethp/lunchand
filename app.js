//Declarations
var express = require('express'),
    lunches = require('./routes/talktomongo'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    multer  = require('multer');

//Configure app
app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', "http://"+req.headers.host+':80');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    }
);
app.set('views', __dirname + '/views')
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(session({secret: 'Martin C. Brody', key: 'EatLunch'}));
app.use(bodyParser());
app.use(multer({dest: __dirname + '/public/uploads/'}));

//Direct Pages
app.get('/', function (req, res) {
  if(req.session.uid === undefined && req.query.login === "improvboston") {
    if(req.query.username !== 'bad') {
      res.render('login');
    } else {
      res.render('login_badun');
    }
  } else if (req.session.uid === undefined) {
		res.render('index_unknown');
  } else {
		res.render('index');
  }
});
app.post('/login', function(req, res) {
  req.session.uid = req.body.uid;
  res.send('200', 'Logged in');
});
app.post('/logout', function(req, res) {
  req.session.destroy();
  res.send('200', 'Logged out');
});
app.post('/register', lunches.register);
app.post('/findLunchers', lunches.findLunchers);

//Actually show the server
server.listen(80);
console.log("Server running at http://127.0.0.1:80/");

//Socket IO stuff
io.sockets.on('connection', function (socket) {
    console.log('Connected!');
    socket.on('login', function (data) {
			lunches.login(data,loginSuccessFail);
    });
    	loginSuccessFail = function(_data) {
			socket.emit('loginFailSuccesss', _data);
    }
});
