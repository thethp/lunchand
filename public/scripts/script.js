var server = io.connect('http://localhost:80');

$('.submit').on('click', function() {
    var foo = 'test';
    socket.emit('bar', foo);
});
