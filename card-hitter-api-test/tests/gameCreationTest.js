const gameCreationTestService = require('../services/gameCreationTestService');
const suffleTestService = require('../services/suffleTestService');

const exportFunction = () => {
    gameCreationTestService.createGame((status) => {
        console.log('################');
        console.log('################');
        console.log('Game creation test');
        console.log('################');
        console.log(`Create game: ${status}`);
    });
    
    suffleTestService.suffle((status) => {
        console.log('################');
        console.log('################');
        console.log('Deck suffle test');
        console.log('################');
        console.log(`Suffle deck: ${status}`);
    });
}

module.exports = exportFunction;