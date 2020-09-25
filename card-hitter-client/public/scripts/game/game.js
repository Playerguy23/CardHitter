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
    let removablePlayerCards = [];
    let removableEnemyCards = [];
    let hand = [];
    let enemyCard = [];

    let enemyRendered = false;

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

    const loadEnemyCard = (card) => {
        let img = document.createElement('img');

        img.src = card.path;
        img.width = 100;
        img.height = 200;

        enemysDiv.appendChild(img);
        enemyElementArray.push(img);

        enemyCard.push(card);
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
                    localStorage.setItem('valiaikainenENEMY', JSON.stringify(data.result));
                    loadEnemyCard(JSON.parse(localStorage.getItem('valiaikainenENEMY')));
                    enemyRendered = true;
                    emitReceived = true;
                    return;
                } else {
                    alert(data.result.msg);
                    emitReceived = true;
                    return;
                }
            }
        });
    }

    const removePlayerComponents = () => {
        for (let i = 0; i < playerElementArray.length; i++) {
            const index = removablePlayerCards.indexOf(playerElementArray[i]);

            if (index > -1) {
                playersDiv.removeChild(playerElementArray[i]);
                playerElementArray = playerElementArray.filter(c => c !== playerElementArray[i]);
                removablePlayerCards = removablePlayerCards.filter(rc => rc !== removablePlayerCards[index]);
            }
        }
    }

    const removeEnemyComponents = () => {
        for (let i = 0; i < enemyElementArray.length; i++) {
            const index = removableEnemyCards.indexOf(enemyElementArray[i]);

            if (index > -1) {
                enemysDiv.removeChild(enemyElementArray[i]);
                enemyElementArray = enemyElementArray.filter(c => c !== enemyElementArray[i]);
                removableEnemyCards = removableEnemyCards.filter(rc => rc !== removableEnemyCards[index]);
                enemyCard.pop();
            }
        }
    }
    const listenHand = () => {
        for (let i = 0; i < playerElementArray.length; i++) {
            playerElementArray[i].addEventListener('click', (e) => {
                e.preventDefault();

                const data = {
                    token: info.token,
                    playerCard: hand[i],
                    enemyCard: enemyCard[0]
                };

                socket.emit('playCard', data);

                let receivedEmit = false;
                socket.on('playCard', (data) => {
                    if (!receivedEmit) {
                        if (data.error) {
                            alert(data.result.msg);
                            return;
                        } else {
                            playersDiv.childNodes[i].style.display = 'none';
                            for (let enemy of enemyElementArray) {
                                enemy.style.display = 'none';
                            }

                            removablePlayerCards.push(playersDiv.childNodes[i]);
                            removableEnemyCards.push(enemysDiv.childNodes[0]);
                        }
                        receivedEmit = true;
                        return;
                    }
                });
            });
        }
    }

    const removeElements = () => {
        removePlayerComponents();
        removeEnemyComponents();
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

        listenHand();
    }

    const disableBeforeEnemy = () => {
        for (let card of playersDiv.children) {
            card.disabled = true;
        }
        pickButton.disabled = true;
    }

    const enableAfterEnemy = () => {
        for (let card of playersDiv.children) {
            card.disabled = false;
        }
        pickButton.disabled = false;
    }

    const timer = () => {
        setInterval(() => {
            if (enemyRendered) {
                enableAfterEnemy();
            } else {
                disableBeforeEnemy();
            }

            removeElements();
        }, 500);
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
        });

        pickButton.addEventListener('click', (e) => {
            e.preventDefault();

            timer();

            pickCardToPlayer();

            if (enemyCard.length < 1) {
                enemyRendered = false;
                pickEnemyCard();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();