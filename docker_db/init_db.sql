CREATE DATABASE IF NOT EXISTS rish;

/*
alter user 'root'@'localhost' identified with mysql_native_password by 'root';
flush privileges;
FLUSH PRIVILEGES;*/

GRANT ALL PRIVILEGES on rish.*
TO 'root'@'%' IDENTIFIED BY 'root'
WITH GRANT OPTION;

USE rish;

CREATE TABLE user_details(user_id INT AUTO_INCREMENT PRIMARY KEY, 
                        email_id VARCHAR(100) UNIQUE,
                        first_name VARCHAR(100),
                        last_name VARCHAR(100));

INSERT INTO user_details(email_id, first_name, last_name)
VALUES('cricketorama.rishabh@gmail.com', 'aaaaa', 'bbbbb');