//Declarations
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('lunchand', server),
    passwordHash = require('password-hash');

//Open database
db.open(function(_err, _db) {
    if(!_err) {
	console.log("Connected to lunchand DB");
	db.collection('lunchers', {strict: true}, function(_err, _collection) {
	    if(_err) {
		console.log("Lunchers collection doesn't exist! Let's fix that!");
		var testLuncher = {username:"username",pwd:"password",officeLocation:"Office Location",teams:"teams",shark: true};
		db.collection('lunchers', function(_err, _collection) {
		    db.collection('lunchers').insert(testLuncher, {safe:true}, function(_err, _result) {});
		});
            } else {
		console.log("Oh it exists");
	    }
	});
    } else {
	console.log("Error Connecting to Station DB: " + _err);
    }
});

var addUser = function(_name, _pwd, _officeLocation, _teams, _img, _secretlyAShark) {
    console.log(_pwd);
    _pwd = passwordHash.generate(_pwd);
    console.log(_pwd);
    db.collection('lunchers', function(_err, _collection) {  
	if(_err) {
	    console.log("Shark attack because: "+_err);
	} else {
	    var luncher = {
		username: _name,
		pwd: _pwd,
		officeLocation: _officeLocation,
		teams: _teams,
	        shark: _secretlyAShark
	    };
	    db.collection('lunchers').insert(luncher, {safe: true}, function(_err, _result) {
		if(_err) {
		    console.log("Bad Jaws! He attacked a luncher again! " + _err);
		} else {
		    console.log("Wild success inserting luncher");
		}
	    });
	}
    });
};

exports.login = function(data) {
    console.log(data);
   db.collection('lunchers', function(_err, _collection) {
       if(_err) {
	   console.log("Sharks attacked this connection! " + _err);
       } else {
	   db.collection('lunchers').findOne({username: data.username}, function(_err, _item) {
	       if(_err) {
		   console.log("Either that person doesn't exist, or a shark ate them.");
	       } else {
		   console.log("Found: "+_item);
	       }
	   });
       } 
   });
}
