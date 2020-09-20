/**
 * @file
 * @author Joonatan Taajamaa
 */

const express = require('express');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const morgan = require('morgan');

const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/public/templates'));
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));

const sivuRoute = require('./rotes/sivuRotes');
const joinedUsersSocket = require('./sockets/sockets');

app.use('/', sivuRoute);

joinedUsersSocket(io);

server.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});