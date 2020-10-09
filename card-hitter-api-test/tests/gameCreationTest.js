const gameCreationTestService = require('../services/gameCreationTestService');

const exportFunction = () => {
    gameCreationTestService.createGame((status) => {
        console.log('################');
        console.log('################');
        console.log('Game creation test');
        console.log('################');
        console.log(`Create game: ${status}`);
    });
}

module.exports = exportFunction;