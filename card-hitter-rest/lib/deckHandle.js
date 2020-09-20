/**
 * @file
 * @author Joonatan Taajamaa
 */

const gameMaps = require('./gameMaps.json');

const deckAssets = gameMaps.assetsMap;
const deck = gameMaps.cardMap;

const provideOne = () => {
    const card = deckAssets[deck[deck.length - 1]];

    deck.pop();

    return card;
}

module.exports = {
    provideOne: provideOne
}