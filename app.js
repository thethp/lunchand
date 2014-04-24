//Declarations
var express = require('express'),
    stations = require('./routes/talktomongo'),
    app = express();

//Configure app
app.use(express.static(__dirname + '/public'));

//Actually show the server
app.listen(80);
console.log("Server running at http://127.0.0.1:80/");
