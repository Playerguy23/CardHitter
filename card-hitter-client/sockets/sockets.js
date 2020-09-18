const cardSocket = require('./cardSocket');
const userSocket = require('./userSocket');

const sockets = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log('user connected!');

        userSocket(socket);
        cardSocket(socket);

        socket.on('disconnect', () => {
            console.log('user disconnected!')
        });
    });
}

module.exports = sockets;