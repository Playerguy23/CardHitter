/**
 * @file
 * @author Joonatan Taajamaa
 */

const userSocket = require('./userSocket');
const userHomeSocket = require('./userHomeSocket');

const sockets = (io) => {
    io.sockets.on('connection', (socket) => {
        console.log('user connected!');

        userSocket(socket);
        userHomeSocket(socket);

        socket.on('disconnect', () => {
            console.log('user disconnected!')
        });
    });
}

module.exports = sockets;