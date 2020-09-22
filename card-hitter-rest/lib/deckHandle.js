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

const provideOne = () => {
    const card = deckAssets[deck[deck.length - 1]];

    return card;
}


module.exports = {
    provideOne: provideOne
}