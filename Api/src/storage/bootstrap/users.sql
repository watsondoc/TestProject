
CREATE TABLE IF NOT EXISTS users (
     id INT PRIMARY KEY NOT NULL,
     name VARCHAR(255) NOT NULL,
     userName VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     phone VARCHAR(255) NOT NULL,
     website VARCHAR(255) NOT NULL,
     address JSON
);

