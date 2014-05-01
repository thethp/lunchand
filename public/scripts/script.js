var socket = io.connect('http://eatlun.ch'),
    officeLocation;

google.maps.event.addDomListener(window, 'load', initialize);
function initialize() {
    officeLocation = new google.maps.places.SearchBox((document.getElementById('pac-input')));

    $('.submit').on('click', function() {
        var foo = 'test';
        socket.emit('login', {username: $('input[name="username"]').val(), password: $('input[name="password"]').val()});
    });

    $('.register').on('click', function() {
        console.log('register');
	if($('input[name="password"]').val() !== $('input[name="passwordConfirm"]').val()) {
            formError($('input[name="password"]'), "Oops! One of your passwords isn't the same as the other! Try again!");
	} else if (officeLocation.getPlaces() == undefined) {
            formError($('input[name="officeLocation"]'), "We really need where you are during lunch.  We won't tell ANYONE. [Honest!]");
	} else {
            socket.emit('register', {
		username: $('input[name="username"]').val(),
		password: $('input[name="password"]').val(),
		officeLocation: $('input[name="officeLocation"]').val(),
		teams: $('input[name="teams"]').val()
            });
	}
    });
};

socket.on('loginFailed', function (_data) {
    $('input').removeClass('error');
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
