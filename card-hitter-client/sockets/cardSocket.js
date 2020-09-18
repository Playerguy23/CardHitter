const fetch = require('node-fetch');
const baseUrl = require('../lib/baseUrl.json');

const sockets = (socket) => {

    socket.on('pickCard', () => {
        const config = {
            method: 'GET'
        }

        fetch(`${baseUrl.url}/card/one`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    socket.emit('pickCard', result);
                });
            }
        });
    });

}

module.exports = sockets;