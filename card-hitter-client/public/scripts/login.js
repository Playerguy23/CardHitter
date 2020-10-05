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
        let submitButton = document.getElementById('submit-button');
        let message = document.getElementById('message');

        usernameInput.addEventListener('change', handleUsernameChange);
        passwordInput.addEventListener('change', handlePasswordChange);

        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            socket.emit('login', { username: username, password: password });

            let received = false;

            socket.on('login', (res) => {
                if (!received) {
                    if (res.error) {
                        message.textContent = res.result.msg;
                        message.classList.add('error');

                        setTimeout(() => {
                            message.classList.remove('error');
                            message.textContent = '';
                            received = true;
                        }, 3000);
                    } else {
                        message.textContent = res.msg;
                        message.classList.add('success');

                        usernameInput.disabled = true;
                        passwordInput.disabled = true;
                        submitButton.disabled = true;

                        localStorage.clear();
                        localStorage.setItem('token', JSON.stringify(res.result));

                        setTimeout(() => {
                            message.classList.remove('success');
                            message.textContent = '';

                            window.location.href = '/home';

                            received = true;
                        }, 1200);
                    }

                    received = true;
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();