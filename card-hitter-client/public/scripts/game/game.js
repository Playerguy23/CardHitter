'use strict';

(function () {
    let socket = io();
    const info = JSON.parse(localStorage.getItem('token'));

    let body;
    let pickButton;
    let suffleButton;

    const cards = [];

    const createDeck = () => {
        const gameId = JSON.parse(localStorage.getItem('game_id'));
        
        const data = {
            token: info.token,
            gameId: gameId
        };

        socket.emit('suffle', data);

        let receivedEmit = false;
        socket.on('suffle', (data) => {

            if (data.error) {
                alert(data.result.msg);
            } else {
                pickButton.style.display = 'block';

                suffleButton.disabled = true;
                suffleButton.style.display = 'none';
            }
            receivedEmit = true;
        });
    }

    const pickCard = () => {
        socket.emit('pickCard', info.token);

        let receivedEmit = false;
        socket.on('pickCard', (data) => {
            if (!receivedEmit) {
                if (!info) {
                    window.location.href = '/login';
                }

                if (!data.error) {
                    localStorage.setItem('valiaikainen', JSON.stringify(data.result));
                } else {
                    window.location.href = '/login';
                }

            }
        });

        cards.push(JSON.parse(localStorage.getItem('valiaikainen')));
        localStorage.removeItem('valiaikainen');
    }

    const loadHand = () => {
        let img = document.createElement('img');
        let card = cards[cards.length - 1];

        img.src = card.path;
        img.width = 100;
        img.height = 200;

        body.appendChild(img);
    }

    const main = () => {
        body = document.querySelector('body');
        suffleButton = document.getElementById('suffle-button');
        pickButton = document.getElementById('pick-button');

        pickButton.style.display = 'none';

        suffleButton.addEventListener('click', (e) => {
            e.preventDefault();

            createDeck();
        });

        pickButton.addEventListener('click', (e) => {
            e.preventDefault();

            pickCard();
            loadHand();
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();