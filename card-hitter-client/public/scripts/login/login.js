(() => {
    let socket = io();

    let username;
    let password;

    const handleUsernameChange = (event) => {
        event.preventDefault();

        username = event.target.value;
    }

    const handlePasswordChange = (event) => {
        event.preventDefault();

        password = event.target.value;
    }

    const main = () => {
        let usernameInput = document.getElementById('username-input');
        let passwordInput = document.getElementById('password-input');
        let loginForm = document.getElementById('login-form');

        usernameInput.addEventListener('change', handleUsernameChange);
        passwordInput.addEventListener('change', handlePasswordChange);

        loginForm.addEventListener('submit', (event) => {
            socket.emit('login', { username: username, password: password });

            let received = false;

            
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();