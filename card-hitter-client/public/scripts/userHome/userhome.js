
(() => {
    const socket = io();
    const info = JSON.parse(localStorage.getItem('token'));

    const main = () => {
        let startButton = document.getElementById('start-button');
        let logoutButton = document.getElementById('logout-button');

        startButton.addEventListener('click', (e) => {
            socket.emit('startGame', info.token);

            let received = false;
            socket.on('startGame', (data) => {
                if (!received) {
                    if(!info) {
                        window.location.href = '/login';
                    }

                    if (data.error) {
                        window.location.href = '/login';

                        received = true;
                    } else {
                        localStorage.removeItem('game_id');
                        localStorage.setItem('game_id', data.id);
                        window.location.href = '/game';

                        received = true;
                    }
                }
            });
        });

        logoutButton.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = '/login';
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();