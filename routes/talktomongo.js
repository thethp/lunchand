//Declarations
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('lunchand', server);

//Open database
db.open(function(_err, _db) {
    if(!_err) {
	console.log("Connected to lunchand DB");
    } else {
	console.log("Error Connecting to Station DB: " + _err);
    }
});

addUser = function(_name, _pwd, _officelocation, _teams, _img, _secretlyAShark) {
    db.createUser({
	"user": _name,
	"pwd": _pwd,
	"customData": {
	    officeLocation: _officeLocation,
	    teams: _teams,
	    shark: _secretlyAShark
	},
	"roles": ["read"] },
        { w: "majority", wtimeout: 5000 }
    );
}

addUser("test1", "pppppp", "DTX", "Legitimo", "ll", "Y");