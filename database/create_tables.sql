USE card_hitter;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(66) NOT NULL,
    username VARCHAR(155) DEFAULT NULL,
    password VARCHAR(155) DEFAULT NULL,
    role VARCHAR(22) DEFAULT NULL,
    last_login DATE,
    registeration DATE,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user_game;
CREATE TABLE IF NOT EXISTS user_game (
    id VARCHAR(66) NOT NULL,
    user_id VARCHAR(66) DEFAULT NULL,
    win BIT,
    cards_played INT(15),
    active BIT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS user_card;
CREATE TABLE IF NOT EXISTS user_card (
    id VARCHAR(66) NOT NULL,
    name VARCHAR(133) DEFAULT NULL,
    path VARCHAR(255) DEFAULT NULL,
    number INT,
    on_game BIT,
    user_card BIT,
    active BIT,
    user_game_id VARCHAR(66) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_game_id) REFERENCES user_game(id)
);