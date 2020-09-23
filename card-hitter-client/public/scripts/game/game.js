'use strict';

(function () {
    let socket = io();
    const info = JSON.parse(localStorage.getItem('token'));

    let playersDiv;
    let enemysDiv;
    let pickButton;
    let suffleButton;

    let playerElementArray = [];
    let enemyElementArray = [];
    let hand = [];
    let enemyCard;

    const createDeck = () => {
        const gameId = localStorage.getItem('game_id');

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

    const listenHand = () => {
        let calculator = 0;
        for (let card of playersDiv.children) {

            
            card.addEventListener('click', (e) => {
                e.preventDefault();

                console.log(hand[calculator])
                const data = {
                    token: info.token,
                    playerCard: hand[calculator],
                    enemyCard: enemyCard
                };

                calculator++;
                
                socket.emit('playCard', data);

                let receivedEmit = false;
                socket.on('playCard', (data) => {
                    if (!receivedEmit) {
                        if (data.error) {
                            alert(data.result.msg);
                            receivedEmit = true;
                        } else {
                            playersDiv.removeChild(card);
                            enemysDiv.removeChild(enemyElementArray[0]);
                            enemyElementArray.pop();
                            pickEnemyCard();
                            receivedEmit = true;
                        }
                    }
                });
            });

        }
    }

    const loadPlayerCard = (card) => {
        let button = document.createElement('button');
        let img = document.createElement('img');

        img.src = card.path;
        img.width = 100;
        img.height = 200;

        button.appendChild(img);
        playersDiv.appendChild(button);
        playerElementArray.push(button);

        hand.push(card);
    }

    const pickCardToPlayer = () => {
        localStorage.setItem('valiaikainen', 'test');
        const gameId = localStorage.getItem('game_id');

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
                    listenHand();
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
    }

    document.addEventListener('DOMContentLoaded', main);
})();