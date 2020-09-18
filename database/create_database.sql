DROP DATABASE IF EXISTS card_hitter;
CREATE DATABASE IF NOT EXISTS card_hitter
    CHARACTER SET utf8 COLLATE utf8_general_ci;

DROP USER IF EXISTS 'card_hitter_user'@'localhost';
CREATE USER IF NOT EXISTS 'card_hitter_user'@'localhost'
    IDENTIFIED BY 'card_hitter_user';

USE card_hitter;

ALTER USER 'card_hitter_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'card_hitter_user';

GRANT ALL PRIVILEGES ON card_hitter.* TO 'card_hitter_user'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;