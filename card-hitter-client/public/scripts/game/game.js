'use strict';

(function () {
    const baseUrl = 'http://localhost:5000/api';
    let socket = io();
    const info = JSON.parse(localStorage.getItem('token'));
    const gameId = localStorage.getItem('game_id');

    let playersDiv;
    let enemysDiv;
    let pickButton;
    let suffleButton;
    let removableButton;

    let playerElementArray = [];
    let enemyElementArray = [];
    let removablePlayerCards = [];
    let removableEnemyCards = [];
    let hand = [];
    let enemyCard = [];

    // let enemyRendered = false;
    let cardsDeleted = false;

    const createDeck = () => {
        const config = {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${info.token}`
            }
        };

        fetch(`${baseUrl}/card/deck/${gameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    pickButton.style.display = 'block';

                    suffleButton.disabled = true;
                    suffleButton.style.display = 'none';
                });
            } else {
                response.json().then(result => {
                    alert(result.msg);
                    window.location.href = '/home';
                });
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

    const listenHand = () => {

        for (let i = 0; i < playersDiv.childNodes.length; i++) {
            playersDiv.childNodes[i].addEventListener('click', (e) => {
                e.preventDefault();

                const data = {
                    token: info.token,
                    playerCard: hand[i],
                    enemyCard: enemyCard[0]
                };

                socket.emit('playCard', data);
                removableButton = playerElementArray[i];
            });
        }
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

    const pickEnemyCard = () => {
        localStorage.setItem('valiaikainenENEMY', 'test');
        const gameId = localStorage.getItem('game_id');

        const data = {
            token: info.token,
            userGameId: gameId
        };

        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${info.token}`
            }
        };

        fetch(`${baseUrl}/card/enemy/pick/${gameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    disableBeforeEnemy();

                    localStorage.setItem('valiaikainenENEMY', JSON.stringify(result));
                    loadEnemyCard(JSON.parse(localStorage.getItem('valiaikainenENEMY')));
                    localStorage.removeItem('valiaikainenENEMY');
                    enableAfterEnemy();
                    // enemyRendered = true;
                    emitReceived = true;
                    return;
                });
            } else {
                response.json().then(result => {
                    alert(data.result.msg);
                    emitReceived = true;
                    return;
                });
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
                hand = hand.filter(c => c !== hand[i]);
                cardsDeleted = true;
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

        button.addEventListener('click', (e) => {
            e.preventDefault();

            const data = {
                token: info.token,
                playerCard: hand[hand.length - 1],
                enemyCard: enemyCard[0]
            };

            socket.emit('playCard', data);
            removableButton = playerElementArray[playerElementArray.length - 1];
        });
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
        });

        pickButton.addEventListener('click', (e) => {
            e.preventDefault();

            if (enemyCard.length < 1) {
                // enemyRendered = false;
                pickEnemyCard();
            }
            pickCardToPlayer();
        });

        setInterval(() => {
            removeElements();
            if (cardsDeleted) {
                // listenHand();
                cardsDeleted = false;
            }
        }, 500);

        let receivedEmit = false;
        socket.on('playCard', (data) => {
            if (!receivedEmit) {
                if (data.error) {
                    alert(data.result.msg);
                    return;
                } else {
                    removableButton.style.display = 'none';
                    for (let enemy of enemyElementArray) {
                        enemy.style.display = 'none';
                    }

                    removablePlayerCards.push(removableButton);
                    removableEnemyCards.push(enemysDiv.childNodes[0]);
                    receivedEmit = true;
                    console.log(removablePlayerCards)
                    return;
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();