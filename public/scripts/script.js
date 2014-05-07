var socket = io.connect('http://eatlun.ch'),
    officeLocation;

google.maps.event.addDomListener(window, 'load', initialize);
function initialize() {
	officeLocation = new google.maps.places.SearchBox((document.getElementById('pac-input')));
	google.maps.event.addListener(officeLocation, 'places_changed', function() {
  	$('input[name="longitude"]').val(officeLocation.getPlaces()[0].geometry.location.A);
  	$('input[name="latitude"]').val(officeLocation.getPlaces()[0].geometry.location.k);
	});
  
  $('.login').on('click', function() {
    event.preventDefault();
  	socket.emit('login', {username: $('input[name="username"]').val(), password: $('input[name="password"]').val()});
  });
  
  $('.register').on('click', function() {
    event.preventDefault();
		if($('input[name="password"]').val() !== $('input[name="passwordConfirm"]').val()) {		
			formError($('input[name="password"]'), "Oops! One of your passwords isn't the same as the other! Try again!");
		}  else if ($('input[name="username"]').val() == "") {
			formError($('input[name="username"]'), "Whoa there, friend.  Can't sign up without a username.");
		}	else if (officeLocation.getPlaces() == undefined) {
			formError($('input[name="officeLocation"]'), "We really need where you are during lunch.  We won't tell ANYONE. [Honest!]");
		} else {
			$('form').submit();
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

var formError = function(_field, _message) {
  _field.addClass('error');
  $('.messageField').show().html(_message);
}
