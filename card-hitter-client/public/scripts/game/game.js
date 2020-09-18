'use strict';

(function () {
    let socket = io();

    let body;
    let pickButton;

    const cards = [];

    const pickCard = () => {
        socket.emit('pickCard');

        let vastaanOtettu = false;
        socket.on('pickCard', (cardDetails) => {
            if (!vastaanOtettu) {
                localStorage.setItem('valiaikainen', JSON.stringify(cardDetails));
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