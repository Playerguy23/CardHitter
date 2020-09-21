USE card_hitter;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
    id VARCHAR(66) NOT NULL,
    username VARCHAR(155),
    password VARCHAR(155),
    role VARCHAR(22),
    last_login DATE,
    registeration DATE,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS user_game;
CREATE TABLE IF NOT EXISTS user_game (
    id VARCHAR(66),
    user_id VARCHAR(66),
    win BIT,
    cards_played INT(15),
    active BIT,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

DROP TABLE IF EXISTS user_card;
CREATE TABLE IF NOT EXISTS user_card (
    id VARCHAR(66),
    name VARCHAR(133),
    path VARCHAR(255),
    number INT,
    on_game BIT,
    user_card BIT,
    active BIT,
    user_game_id VARCHAR(66),
    PRIMARY KEY (id),
    FOREIGN KEY (user_game_id) REFERENCES user_game(id)
);