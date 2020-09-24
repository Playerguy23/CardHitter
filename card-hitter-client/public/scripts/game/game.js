'use strict';

(function () {
    let socket = io();
    const info = JSON.parse(localStorage.getItem('token'));
    const gameId = localStorage.getItem('game_id');

    let playersDiv;
    let enemysDiv;
    let pickButton;
    let suffleButton;

    let playerElementArray = [];
    let enemyElementArray = [];
    let hand = [];
    let enemyCard;

    const createDeck = () => {

        const data = {
            token: info.token,
            userGameId: gameId
        };

        socket.emit('suffle', data);

        let receivedEmit = false;
        socket.on('suffle', (data) => {

            if (!receivedEmit) {
                if (data.error) {
                    alert(data.result.msg);
                    window.location.href = '/home';
                } else {
                    pickButton.style.display = 'block';

                    suffleButton.disabled = true;
                    suffleButton.style.display = 'none';
                }
                receivedEmit = true;
            }
        });
    }

    function listenHand() {
        for (let i = 0; i < playerElementArray.length; i++) {
            playerElementArray[i].addEventListener('click', (e) => {
                e.preventDefault();

                const data = {
                    token: info.token,
                    playerCard: hand[i],
                    enemyCard: enemyCard
                };

                socket.emit('playCard', data);

                let receivedEmit = false;
                socket.on('playCard', (data) => {
                    if (!receivedEmit) {
                        if (data.error) {
                            alert(data.result.msg);
                            receivedEmit = true;
                        } else {
                            playersDiv.childNodes[i].style.display = 'none';
                            enemysDiv.childNodes[i].style.display = 'none';
                            pickEnemyCard();
                            receivedEmit = true;
                        }
                    }
                });
            });
        }
    }

    const loadEnemyCard = (card) => {
        let img = document.createElement('img');

        img.src = card.path;
        img.width = 100;
        img.height = 200;

        enemysDiv.appendChild(img);
        enemyElementArray.push(img);
    }

    const pickEnemyCard = () => {
        localStorage.setItem('valiaikainenENEMY', 'test');
        const gameId = localStorage.getItem('game_id');

        const data = {
            token: info.token,
            userGameId: gameId
        };

        socket.emit('enemyPick', data);

        let emitReceived = false;
        socket.on('enemyPick', (data) => {
            if (!emitReceived) {
                if (!data.error) {
                    enemyCard = data.result;
                    loadEnemyCard(enemyCard);
                    emitReceived = true;
                } else {
                    alert(data.result.msg);
                    emitReceived = true;
                }
            }
        });
    }

    const loadPlayerCard = (card) => {
        let button = document.createElement('button');
        let img = document.createElement('img');

        button.classList.add(card.number);

        img.src = card.path;
        img.width = 100;
        img.height = 200;
        img.classList.add(card.number);

        button.appendChild(img);
        playersDiv.appendChild(button);
        playerElementArray.push(button);

        hand.push(card);
    }

    const pickCardToPlayer = () => {
        localStorage.setItem('valiaikainen', 'test');

        const data = {
            token: info.token,
            userGameId: gameId
        };
        socket.emit('pickCard', data);

        let receivedEmit = false;
        socket.on('pickCard', (data) => {
            if (!receivedEmit) {
                if (!info) {
                    window.location.href = '/login';
                }

                if (!data.error) {
                    localStorage.setItem('valiaikainen', JSON.stringify(data.result));
                    loadPlayerCard(JSON.parse(localStorage.getItem('valiaikainen')));
                    receivedEmit = true;
                } else {
                    receivedEmit = true;
                    alert(data.result.msg);
                }
            }
        });
    }

    const main = () => {
        enemysDiv = document.getElementById('enemy-card');
        playersDiv = document.getElementById('player-cards');
        suffleButton = document.getElementById('suffle-button');
        pickButton = document.getElementById('pick-button');

        pickButton.style.display = 'none';

        suffleButton.addEventListener('click', (e) => {
            e.preventDefault();

            createDeck();
            pickEnemyCard();
        });

        pickButton.addEventListener('click', (e) => {
            e.preventDefault();


            pickCardToPlayer();
        });

        setInterval(() => { listenHand(); }, 1000);
    }

    document.addEventListener('DOMContentLoaded', main);
})();