/**
 * @file
 * @author Joonatan Taajamaa
 */

const addPlayedCards = (cardAmount, cardsPlayed) => {
    const newCardAmount = cardAmount + cardsPlayed;

    return newCardAmount;
}

const newCardNumber = (totalOfCards) => {
    totalOfCards++;
    return totalOfCards;
}

module.exports = {
    addPlayedCards: addPlayedCards,
    newCardNumber: newCardNumber
}