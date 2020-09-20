/**
 * @file
 * @author Joonatan Taajamaa
 */

const addPlayedCards = (cardAmount, cardsPlayed) => {
    const newCardAmount = cardAmount + cardsPlayed;

    return newCardAmount;
}

module.exports = {
    addPlayedCards: addPlayedCards
}