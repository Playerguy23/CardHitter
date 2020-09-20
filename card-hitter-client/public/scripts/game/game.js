'use strict';

(function () {
    let socket = io();
    const info = JSON.parse(localStorage.getItem('token'));

    let body;
    let pickButton;

    const cards = [];

    const pickCard = () => {
        socket.emit('pickCard', info.token);

        let vastaanOtettu = false;
        socket.on('pickCard', (data) => {
            if (!vastaanOtettu) {
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
        pickButton = document.getElementById('pick-button');

        pickButton.addEventListener('click', (e) => {
            e.preventDefault();

            pickCard();
            loadHand();
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();