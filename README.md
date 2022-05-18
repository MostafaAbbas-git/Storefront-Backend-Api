# Storefront-Backend-Api

This is an E-commerce API.

## Table of Contents

- [Toolbox](#toolbox)
- [Database Setup](#Database-Setup)
- [Setting Up the Environment](#setting-up-the-environment)
- [Endpoints ](#endpoints)
- [Author](#Author)
- [About](#about)

## Toolbox

- Typescript
- Express
- PostgreSQL

## Database Setup

**_PS_**: make sure you have a PostgreSQL server installed in your system. If not, refer to the PostgreSQL documentation on [www.postgresql.org](www.postgresql.org) to install the server.
<br></br>

The server application is configured to run with a Postgresql database running with the following settings:

- Host: localhost
- Port: 5432
- Database user: "storeuser"
- Database name: "storefront"
- Test database name: "storefront_test"
- Create the database for devolpment and testing by followint the steps below.

## Setting Up the Environment

1. Install the requirements and dependancies

   ```sh
   $ npm install
   ```

2. Create the database <br>

   - In the Windows Command Prompt, run the command:

   ```sh
   $ psql -U userName
   ```

   - Enter your password when prompted.

   ```sh
   $ Your_Passowrd
   ```

   - Create a PostgreSQL user:

   ```sh
   $ CREATE USER storeuser WITH PASSWORD 'password123';
   ```

   - Run the following commands to create the main database used for `development` and the testing one:

   ```sh
   $ CREATE DATABASE storefront WITH ENCODING 'UTF8';
   $ CREATE DATABASE storefront_test WITH ENCODING 'UTF8';
   ```

   - Grant all database privileges to user in both databases:

   ```sh
   $ GRANT ALL PRIVILEGES ON DATABASE storefront TO storeuser;

   $ GRANT ALL PRIVILEGES ON DATABASE storefront_test TO storeuser;
   ```

   - Connect to development database `storefront` using the command:

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

- Build the project

  ```sh
  $ npm run build
  ```

- install db-migrate npm package globally

  ```sh
  $ npm install -g db-migrate
  ```

- Migrate Database

  ```sh
  $ npm run migrate-dev-up
  ```

- Run the project

  - Host: localhost
  - Port: 3000

  ```sh
  $ npm run start
  ```

- Run tests <br>
  **_PS_**: Testing database will not be dropped after runnint the tests.

  ```sh
  $ npm run test
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

| HTTP verbs | paths                             | Used for                                                   |
| ---------- | --------------------------------- | ---------------------------------------------------------- |
| GET        | /users/index                      | Index [token required] [admin required]                    |
| GET        | /users/show                       | Show [token required] [admin required]                     |
| PATCH      | /users/role                       | Change User Role [token required] [admin required]         |
| DELETE     | /users/delete                     | Delete User [token required] [admin required]              |
| GET        | /users/myProfile                  | Show Logged-in User Data [token required]                  |
| POST       | /users                            | Create                                                     |
| POST       | /users/authenticate               | Login                                                      |
| PATCH      | /users/myProfile                  | Update Logged-in User Data [token required]                |
| POST       | /products                         | Create [token required] [admin required]                   |
| DELETE     | /products/:id                     | DELETE [token required] [admin required]                   |
| GET        | /products                         | Index                                                      |
| GET        | /products/:id                     | Show                                                       |
| GET        | /orders                           | Index [token required] [admin required]                    |
| GET        | /orders/pending-carts             | Index Pending Carts [token required] [admin required]      |
| GET        | /orders/active-carts              | Index Active Carts [token required] [admin required]       |
| GET        | /orders/show-one                  | Show [token required] [admin required]                     |
| POST       | /orders                           | Create [token required]                                    |
| POST       | /orders/add-to-cart               | Add Product To Cart [token required]                       |
| PATCH      | /orders/mycart/removeProduct      | Remove Product From Cart [token required]                  |
| GET        | /orders/mycart                    | Index Logged-in User Cart [token required]                 |
| GET        | /orders/myorders/my-pending-order | Show Logged-in Pending Order [token required]              |
| GET        | /orders/myorders/show-one         | Show One Order [token required]                            |
| GET        | /orders/myorders/show-all         | Index All My Orders [token required]                       |
| PATCH      | /orders/submit                    | Submit My Order [token required]                           |
| DELETE     | /orders/delete                    | Delete My Order [token required]                           |
| GET        | /dashboard/five-most-popular      | Index Popular Products                                     |
| GET        | /dashboard/filter/:category       | Show Products By Category                                  |
| GET        | /dashboard/five-most-expensive    | Index Most Expensive Products                              |
| GET        | /dashboard/users-with-orders      | Index Users With Orders [token required] [admin required]  |
| GET        | /dashboard/products_in_orders     | Index Products in Orders [token required] [admin required] |

## Author

- Mostafa M. Abbas- (https://github.com/MostafaAbbas-git)
- Udacity email: mostafa.abdelsadek99@eng-st.cu.edu.eg

## About

This project is a part of Advanced Full-Stack Web Development Nanodegree Program by Udacity and FWD.\
Instructor: Mohamed Elshafeay
