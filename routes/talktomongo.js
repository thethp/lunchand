//Declarations
var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    server = new Server('localhost', 27017, {auto_reconnect: true}),
    db = new Db('lunchand', server),
    passwordHash = require('password-hash'),
    ObjectId = require('mongodb').ObjectID;

//Open database
db.open(function(_err, _db) {
	if(!_err) {
		console.log("Connected to lunchand DB");
		db.collection('lunchers', {strict: true}, function(_err, _collection) {
	  	if(_err) {
				console.log("Lunchers collection doesn't exist! Let's fix that!");
				var testLuncher = {username:"tester",pwd:"password",officeLocation:"Office Location",loc:[ -71.10103600000002, 42.369149 ], geoJSON: { type : "Point", "coordinates" : [ -71.10103600000002, 42.369149 ] },teams:"teams",bio: "I'm a shark"};
				db.collection('lunchers', function(_err, _collection) {
					db.collection('lunchers').insert(testLuncher, {safe:true}, function(_err, _result) {});
					db.collection('lunchers').ensureIndex({loc: "2d" });
				});
      } else {
				console.log("Oh it exists");
				db.collection('lunchers', function(_err, _collection) {
					db.collection('lunchers').ensureIndex({loc: "2d" });
					db.collection('lunchers').ensureIndex({geoJSON: "2dsphere" });
				});
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
				loc: [_data.longitude, _data.latitude],
				geoJSON: { type : "Point" , coordinates: [ _data.longitude, _data.latitude ] },
				bio: _data.bio,
				facebook: _data.facebook,
				twitter: _data.twitter
			};
			db.collection('lunchers').findOne({username: _data.username}, function(_err, _item) { 
				if(_err || _item == undefined) {
					db.collection('lunchers').insert(luncher, {safe: true}, function(_err, _result) {
						if(_err) {
							console.log("Bad Jaws! He attacked a luncher again! " + _err);
						} else {
							console.log("Wild success inserting luncher");
							_callback({success: true});
						}
					});
				} else {
					_callback({success: false, username: true});
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

exports.userDetail = function(_userID, _detail) {
	console.log("id: " +_userID);
	db.collection('lunchers', function(_err, _collection) {
		if(_err) {
			console.log("Sharks attacked this connection! " + _err);
		} else {
			db.collection('lunchers').findOne({_id: ObjectId(_userID)}, function(_err, _item) {
				if(_err || _item == undefined) {
					console.log('User does not exist, perhaps they were eaten by a shark!');
					return undefined;
				} else {
					console.log("Returning attribute: " + _item[_detail]);
					return _item[_detail];
				}
			});
	  }
  });
}

exports.findLunchers = function(req, res) {
	db.collection('lunchers', function(_err, _collection) {
		if(_err) {
			console.log("Sharks attacked this connection! " + _err);
		} else {
			db.collection('lunchers').findOne({_id: ObjectId(req.session.uid)}, function(_err, _item) {
				if(_err || _item == undefined) {
					console.log('User does not exist, perhaps they were eaten by a shark!');
					res.send(undefined);
				} else {
					console.log('Attained Users GEOJSON at: '+ _item.geoJSON +', attempting to find close users');
					db.collection('lunchers').find({geoJSON:{ $near: {$geometry: _item.geoJSON, $maxDistance: 800}}}, {pwd: 0, geoJSON: 0, officeLocation: 0}).toArray(function(err, items){
																							if(err) {
																								console.log("Error finding items");
																								res.send(undefined);
																							} else {
																								items.forEach(function(obj) {
																									obj.distance = distance(_item.loc, obj.loc);
																									delete obj.loc;
																								});
																								res.send(items);
																							}
																						});
				}
			});
		}
	});
}

distance = function(userLoc,otherLoc) {
	//var R = 6371; // km
	var R = 3959; //miles
	var radiansMultiplier = Math.PI/180;
	var φ1 = userLoc[1]*radiansMultiplier;
	var φ2 = otherLoc[1]*radiansMultiplier;
	var Δφ = (otherLoc[1]-userLoc[1])*radiansMultiplier;
	var Δλ = (otherLoc[0]-userLoc[0])*radiansMultiplier;
	
	var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
	        Math.cos(φ1) * Math.cos(φ2) *
	        Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	
	var d = R * c;
	return Math.round(d*100)/100;
}
