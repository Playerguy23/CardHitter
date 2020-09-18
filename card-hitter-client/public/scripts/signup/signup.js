
(() => {
    let socket = io();
    let username;
    let password;
    let retypePassword;

    const handleUsernameChange = (event) => {
        event.preventDefault();
        username = event.target.value;
    }

    const handlePasswordChange = (event) => {
        event.preventDefault();
        password = event.target.value;
    }

    const handleRetypeChange = (event) => {
        event.preventDefault();
        retypePassword = event.target.value;
    }

    const main = () => {
        let usernameInput = document.getElementById('username-input');
        let passwordInput = document.getElementById('password-input');
        let retypeInput = document.getElementById('retype-input');
        let signupForm = document.getElementById('signup-form');
        let message = document.getElementById('message');

        usernameInput.addEventListener('change', handleUsernameChange);
        passwordInput.addEventListener('change', handlePasswordChange);
        retypeInput.addEventListener('change', handleRetypeChange);

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (password === retypePassword) {
                const data = {
                    username: username,
                    password: password
                };

                socket.emit('signup', data);

                let vastaanOtettu = false;
                socket.on('signup', (res) => {
                    if (!vastaanOtettu) {
                        message.textContent = res.result.msg;

                        if (res.error) {
                            message.classList.add('error');
                            setTimeout(() => {
                                message.textContent = '';
                                vastaanOtettu = true;
                            }, 4000);
                        } else {
                            message.classList.add('success');
                            usernameInput.disabled = true;
                            passwordInput.disabled = true;
                            retypeInput.disabled = true;

                            setTimeout(() => {
                                message.classList.remove('success');
                                message.textContent = '';
                                window.location.href = '/login';
                                vastaanOtettu = true;
                            }, 2000);
                        }
                    }
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();