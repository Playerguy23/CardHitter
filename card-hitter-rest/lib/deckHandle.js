/**
 * @file
 * @author Joonatan Taajamaa
 */

const gameMaps = require('./gameMaps.json');

const deckAssets = gameMaps.assetsMap;
const deck = gameMaps.cardMap;

const changeSwapValuesInArray = (deck) => {
    let returnArray = deck;
    
    for (let i = 0; i < returnArray.length - 3; i++) {
        let randomIndex = i + Math.round(Math.random(3 - 1) + 1);
        let temp = returnArray[i];
        returnArray[i] = returnArray[randomIndex];
        returnArray[randomIndex] = temp;
    }

    return returnArray;
}

const suffleDeck = (deck) => {
    let returnDeck = deck;
    let randomNum = Math.round(Math.random(90 - 50) + 50);

    for (let i = 0; i < randomNum; i++) {
        returnDeck = changeSwapValuesInArray(returnDeck);
    }

    return returnDeck;
}

const provideDeck = () => {
    let suffeled = suffleDeck(deck);
    const card = [];
    for (let i = 0; i < suffeled.length; i++) {
        card.push(deckAssets[suffeled[i]]);
    }

    const data = {
        size: suffeled.length,
        cards: card
    }
    return data;
}


module.exports = {
    provideDeck: provideDeck,
    suffleDeck: suffleDeck
}