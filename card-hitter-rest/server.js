const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
 
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'));

const userRote = require('./routes/userRote');
const cardRoute = require('./routes/cardRoute');

app.use('/api/user', userRote);
app.use('/api/card', cardRoute);

app.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});