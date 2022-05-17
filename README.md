# Storefront-Backend-Api

This is an E-commerce API.

## Table of Contents

- [Toolbox](#toolbox)
- [Setting Up the Environment](#setting-up-the-environment)
- [Endpoints ](#endpoints)
- [Author](#Author)
- [About](#about)

## Toolbox

- Typescript
- Express
- PostgreSQL

## Setting Up the Environment

**_PS_**: make sure you have a PostgreSQL server installed in your system. If not, refer to the PostgreSQL documentation on [www.postgresql.org](www.postgresql.org) to install the server.
<br></br>

1. Install the requirements and dependancies

   ```sh
   $ npm install
   ```

2. Create the database <br>

   - In the Windows Command Prompt, run the command:

   ```sh
   $ psql -U userName
   or just use '$ psql' to login with your root PostgreSQL user.
   ```

   - Enter your password when prompted.

   ```sh
   $ Your_Passowrd
   ```

   - Run the following command to create the main database used for `development`:

   ```sh
   $ CREATE DATABASE storefront WITH ENCODING 'UTF8';
   ```

   - Connect to the new database using the command:

   ```sh
   $ \c storefront
   ```

   - Terminate the process using the following command:

   ```sh
   $ \q
   ```

## Run Scripts

- Rename `.env.example` file to `.env`
- Write your PostgreSQL userName and password in `.env`

<!-- - Run the following commands to create the database needed for `testing`

  ```sh
  npm run create-test-db
  ``` -->

- Build the project

  ```sh
  $ npm run build
  ```

- Migrate Database

  ```sh
  $ npm run migrate-dev-up
  ```

- Run the project

  ```sh
  $ npm run start
  ```

- Run tests FOR THE FIRST TIME <br>
  **_PS_**: The following command will run the following scripts in sequence: Create testing database named: `storefront_test`, Migrate up the testing database, run testing scripts, and finally migrate down. Notice that the testing database will not be dropped.

  ```sh
  $ npm run test
  ```

- Run tests LATER <br>
  **_PS_**: We Cannot command `npm run test` one more time because as mentioned above, it creates the database. But now we have built the project and only wants to run the test scripts separately. To do so, run the following command:

  ```sh
  $ npm run jasmine
  ```

- To drop the `dev` or `test` database (For whatever the reason is).

  ```sh
  $ npm run drop-dev-db

  or

  $ npm run drop-test-db

  ```

---

## Endpoints

- Full API Documentation:
  [Go to the Documentation Page](https://documenter.getpostman.com/view/14046968/UyxjFmBM#65ae3ab3-93b2-4b06-8b73-ebe5079bc80b)

- HomePage:

  ```sh
  http://localhost:3000/
  ```

- Products:
  ```sh
  http://localhost:3000/products
  ```
- Dashboard:
  ```sh
  http://localhost:3000/dashboard/five-most-popular
  ```

## Author

- Mostafa M. Abbas- (https://github.com/MostafaAbbas-git)
- Udacity email: mostafa.abdelsadek99@eng-st.cu.edu.eg

## About

This project is a part of Advanced Full-Stack Web Development Nanodegree Program by Udacity and FWD.\
Instructor: Mohamed Elshafeay
