var socket = io.connect('http://eatlun.ch'),
    officeLocation;

google.maps.event.addDomListener(window, 'load', initialize);
function initialize() {
	officeLocation = new google.maps.places.SearchBox((document.getElementById('pac-input')));
  $('.submit').on('click', function() {
  	socket.emit('login', {username: $('input[name="username"]').val(), password: $('input[name="password"]').val()});
  });
  $('.register').on('click', function() {
		if($('input[name="password"]').val() !== $('input[name="passwordConfirm"]').val()) {		
			formError($('input[name="password"]'), "Oops! One of your passwords isn't the same as the other! Try again!");
		} else if (officeLocation.getPlaces() == undefined) {
			formError($('input[name="officeLocation"]'), "We really need where you are during lunch.  We won't tell ANYONE. [Honest!]");
		} else {
			socket.emit('register', {
				username: $('input[name="username"]').val(),
				password: $('input[name="password"]').val(),
				officeLocation: $('input[name="officeLocation"]').val(),
				teams: $('input[name="teams"]').val(),
				longitude: officeLocation.getPlaces()[0].geometry.location.A,
				latitude: officeLocation.getPlaces()[0].geometry.location.k,
				bio: $('input[name="bio"]').val(),
				facebook: $('input[name="facebook"]').val(),
				twitter: $('input[name="twitter"]').val()
			});
		}
	});
};

socket.on('loginFailSuccesss', function (_data) {
  $('input').removeClass('error');
  if(_data.success == true) {
		$.post('/login', {uid: _data.userID}, function(){window.location='/';});
		return;
  }
  if(_data.username == true) {
		formError($('input[name="username"]'), "That's not your username! It's not anyones!");
  } else {
		formError($('input[name="password"]'), "Psst. Your passwords off a bit. Don't worry, it's between you and me.");
  }
});

socket.on('registrationFail', function (_data) {
  $('input').removeClass('error');
  if(_data.username == true && _data.success == false) {
		formError($('input[name="username"]'), "I'm sorry friend! Someone else took that name.  It's a nice name, but I'm sure there's another you can use!");
  }
})

var formError = function(_field, _message) {
  _field.addClass('error');
  $('.messageField').show().html(_message);
}
