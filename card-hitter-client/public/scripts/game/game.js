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

        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${info.token}`
            }
        };

        disableBeforeEnemy();
        fetch(`${baseUrl}/card/enemy/pick/${gameId}`, config).then(response => {
            if (response.ok) {
                response.json().then(result => {
                    localStorage.setItem('valiaikainenENEMY', JSON.stringify(result));
                    loadEnemyCard(JSON.parse(localStorage.getItem('valiaikainenENEMY')));
                    localStorage.removeItem('valiaikainenENEMY');
                    enableAfterEnemy();

                    return;
                });
            } else {
                response.json().then(result => {
                    alert(result.msg);
                    enableAfterEnemy();
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

            let handIndex = hand.indexOf(card);

            const config = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${info.token}`
                }
            }
            fetch(`${baseUrl}/card/out?playerCardId=${hand[handIndex].id}&enemyCardId=${enemyCard[0].id}`, config)
                .then(response => {
                    if (response.status === 404) {
                        alert('Pahoittelut ongelma kortin kanssa.')
                        removablePlayerCards.push(playerElementArray[handIndex]);
                    } else {
                        if (response.ok) {
                            response.json().then(result => {
                                playerElementArray[handIndex].style.display = 'none';
                                for (let enemy of enemyElementArray) {
                                    enemy.style.display = 'none';
                                }

                                removablePlayerCards.push(playerElementArray[handIndex]);
                                removableEnemyCards.push(enemysDiv.childNodes[0]);
                                return;
                            });
                        } else {
                            response.json().then(result => {
                                alert(result.msg);
                                return;
                            });
                        }
                    }

                });
        });
    }

    const pickCardToPlayer = () => {
        localStorage.setItem('valiaikainen', 'test');

        if (!info) {
            window.location.href = '/login';
        }

        const config = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${info.token}`
            }
        };

        fetch(`${baseUrl}/card/player/pick/${gameId}`, config).then(response => {
            switch (response.status) {
                case 204:
                    alert('Voitit pelin');
                    window.location.href = '/home';
                    break;
                case 401:
                    window.location.href = '/login';
                    break;
                case 406:
                    alert('Hävisit pelin!');
                    window.location.href = '/home';
                    break;
                default:
                    if (response.ok) {
                        response.json().then(result => {
                            localStorage.setItem('valiaikainen', JSON.stringify(result));
                            loadPlayerCard(JSON.parse(localStorage.getItem('valiaikainen')));
                        });
                    } else {
                        response.json().then(result => {
                            alert(result.msg);
                        });
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

            removeElements();

            if (enemyCard.length < 1) {
                pickEnemyCard();
            }
            pickCardToPlayer();
        });
    }

    document.addEventListener('DOMContentLoaded', main);
})();