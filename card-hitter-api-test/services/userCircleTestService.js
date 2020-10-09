const uuid = require('uuid');
const fetch = require('node-fetch');

const userInfo = require('../lib/userInfo.json');
const baseUrl = require('../lib/baseUrl.json');

const userSignup = (callback) => {
    const user = userInfo;

    user.username += uuid.v4();
    const config = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userInfo)
    }

    fetch(`${baseUrl.url}/user/signup`, config).then(response => {
        if (response.ok) {
            response.json().then(result => {
                return callback(user, 'success');
            });
        } else {
            response.json().then(result => {
                return callback(result.msg, 'fail to register');
            });
        }
    });
}

const loginUser = (user, callback) => {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }

    fetch(`${baseUrl.url}/user/login`, config).then(response => {
        if(response.ok) {
            response.json().then(result => {
                return callback(result, 'success');
            });
        } else {
            response.json().then(result => {
                return callback(result.msg, 'fail to login');
            });
        }
    });
}

module.exports = {
    userSignup: userSignup,
    loginUser: loginUser
}