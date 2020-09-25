/**
 * @file
 * @author Joonatan Taajamaa
 */

const gameMaps = require('./gameMaps.json');

const deckAssets = gameMaps.assetsMap;
const deck = gameMaps.cardMap;

const changeIndexes = (deck) => {
    // TODO: for loop that suffles cards
}

const suffleDeck = () => {
    // TODO: for loop that goes from 0 to random number
}

const provideDeck = () => {
    const card = [];
    for(let i = 0; i < deck.length; i++) {
        card.push(deckAssets[deck[i]]);
    }

    const data = {
        size: deck.length,
        cards: card
    }
    return data;
}


module.exports = {
    provideDeck: provideDeck
}