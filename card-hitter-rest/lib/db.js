/**
 * @file
 * @author Joonatan Taajamaa
 */

const msyql = require('mysql');

const connection = msyql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'card_hitter_user',
    password: 'card_hitter_user',
    database: 'card_hitter'
});

const startConnection = () => {
    let newConnection = false;

    if (!connection) {
        newConnection = true;
    }

    try {
        connection.connect();
    } catch (error) {
        console.log(error);
        console.log('Ongelma ytheydessä');
    } finally {
        if (newConnection && connection) {
            connection.end()
        }
    }
}

startConnection();

module.exports = connection;