BASH - mysqladmin -u root create AWESOME_DB

CREATE DATABASE database name;

USE AWESOME_DB;

SHOW tables;

CREATE TABLE potluck (id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(20),
food VARCHAR(30),
confirmed CHAR(1),
signup_date DATE);

DESCRIBE potluck;

INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`) VALUES (NULL, "John", "Casserole","Y", '2012-04-11');
INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`) VALUES (NULL, "Sandy", "Key Lime Tarts","N", '2012-04-14');
INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`) VALUES (NULL, "Tom", "BBQ","Y", '2012-04-18');
INSERT INTO `potluck` (`id`,`name`,`food`,`confirmed`,`signup_date`) VALUES (NULL, "Tina", "Salad","Y", '2012-04-10');

UPDATE `potluck`
SET
`confirmed` = 'Y'
WHERE `potluck`.`name` ='Sandy';

ALTER TABLE potluck ADD email VARCHAR(40);

ALTER TABLE potluck DROP email;

DELETE from potluck where food='BBQ';

-- LOAD DATA INFILE '/home/bob/record_collection' INTO TABLE collecton FIELDS TERMINATED BY ',' ENCLOSED BY ''' LINES TERMINATED BY 'n'
