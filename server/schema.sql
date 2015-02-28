DROP DATABASE IF EXISTS
  chat;

CREATE DATABASE chat;

USE chat;

DROP TABLE IF EXISTS
 messages, rooms, users;

CREATE TABLE messages (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  text VARCHAR(140),
  room_id INT,
  user_id INT,
  created_at DATE,
  updated_at DATE
);

CREATE TABLE rooms (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(32),
  created_at DATE,
  updated_at DATE
);

CREATE TABLE users (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(32),
  post_count INT(8),
  last_post DATE,
  created_at DATE,
  updated_at DATE
);




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/
