//Declarations
var express = require('express'),
    stations = require('.talktomongo'),
    app = express();

//Configure app
app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(allowCrossDomain);
    app.use(express.static(__dirname + '/public'));
});

//Actually show the server
app.listen(80);
console.log("Server running at http://127.0.0.1:80/");
