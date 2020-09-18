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

DROP TABLE IF EXISTS user_deck;
CREATE TABLE IF NOT EXISTS user_deck (
    id VARCHAR(66),
    name VARCHAR(133),
    path VARCHAR(255),
    user_id VARCHAR(66),
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);