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

exports.register = function(_data, _callback) {
	_data.password = passwordHash.generate(_data.password);
	db.collection('lunchers', function(_err, _collection) {  
		if(_err) {
			console.log("Shark attack because: "+_err);
		} else {
			var luncher = {
				username: _data.username,
				pwd: _data.password,
				officeLocation: _data.officeLocation,
				teams: _data.teams,
				loc: [_data.longitude, _data.latitude]
			};
			db.collection('lunchers').insert(luncher, {safe: true}, function(_err, _result) {
				if(_err) {
					console.log("Bad Jaws! He attacked a luncher again! " + _err);
				} else {
					console.log("Wild success inserting luncher");
					_callback({success: true});
				}
			});
		}
	});
};

exports.login = function(_data,_callback) {
	db.collection('lunchers', function(_err, _collection) {
		if(_err) {
			console.log("Sharks attacked this connection! " + _err);
		} else {
			db.collection('lunchers').findOne({username: _data.username}, function(_err, _item) {
				if(_err || _item == undefined) {
					console.log('User does not exist, perhaps they were eaten by a shark!');
					_callback({success: false, username: true});
				} else {
					if(passwordHash.verify(_data.password, _item.pwd)) {
						_callback({success: true, userID: _item._id});
					} else {
						_callback({success: false, username: false});
					}
				}
			});
		} 
	});
}
