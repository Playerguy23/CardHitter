const userCircleTestService = require('../services/userCircleTestService');

const exportFunction = () => {
    console.log('################');
    console.log('User circle test!');
    console.log('################');
    console.log('Signup');
    userCircleTestService.userSignup((result, status) => {
        console.log(`User signup test: ${status}. Message: ${result}`)

        console.log('################');
        console.log('Login');
        userCircleTestService.loginUser((result, status) => {
            console.log(`User login test: ${status}. Message: ${result}`)
        });
    });
}
module.exports = exportFunction;