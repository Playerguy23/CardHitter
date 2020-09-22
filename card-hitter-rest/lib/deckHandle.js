/**
 * @file
 * @author Joonatan Taajamaa
 */

const gameMaps = require('./gameMaps.json');

const deckAssets = gameMaps.assetsMap;
const deck = gameMaps.cardMap;

const changeIndexes = (deck) => {

}

const suffleDeck = () => {

}

const provideOne = () => {
    const card = deckAssets[deck[deck.length - 1]];

    return card;
}


module.exports = {
    provideOne: provideOne
}