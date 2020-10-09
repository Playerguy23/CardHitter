const userCircleTestService = require('../services/userCircleTestService');

const exportFunction = () => {

    userCircleTestService.userSignup((user, status) => {
        console.log('User circle test!');
        console.log('################');
        console.log('Signup');
        console.log(`User signup test: ${status}.`)

        userCircleTestService.loginUser(user, (result, status) => {
            console.log('################');
            console.log('Login');
            console.log(`User login test: ${status}.`)
        });
    });
}
module.exports = exportFunction;