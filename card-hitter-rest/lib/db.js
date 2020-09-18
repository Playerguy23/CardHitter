const msyql = require('mysql');

const connection = msyql.createConnection({
    port: 3306,
    host: 'localhost',
    user: 'card_hitter_user',
    password: 'card_hitter_user',
    database: 'card_hitter'
});

connection.connect();

module.exports = connection;