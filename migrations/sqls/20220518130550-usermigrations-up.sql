/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR (50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    user_role integer default 0 NOT NULL
);