var socket = io.connect('http://eatlun.ch');

socket.on('loginFailed', function (_data) {
    console.log(_data);
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

$('.submit').on('click', function() {
    console.log('click');
    var foo = 'test';
    socket.emit('login', {username: $('input[name="username"]').val(), password: $('input[name="password"]').val()});
});
