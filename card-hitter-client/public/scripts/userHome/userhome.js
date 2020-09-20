
(() => {
    const socket = io();
    const info = JSON.parse(localStorage.getItem('token'));

    const main = () => {
        let startButton = document.getElementById('start-button');

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
                        localStorage.setItem('game_id', JSON.stringify(data.id));
                        window.location.href = '/game';

                        received = true;
                    }
                }
            });
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();