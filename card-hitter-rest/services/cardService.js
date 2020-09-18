const deckHandle = require('../lib/deckHandle');

const sendOne = () => {
    return deckHandle.provideOne();
}

module.exports = {
    sendOne: sendOne
}