var socket = io.connect('http://eatlun.ch');

$('.submit').on('click', function() {
    console.log('click');
    var foo = 'test';
    socket.emit('login', {username: $('input[name="username"]').val(), password: $('input[name="password"]').val()});
});
