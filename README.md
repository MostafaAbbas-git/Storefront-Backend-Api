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

1. Install the requirements and dependancies

   ```sh
   npm install
   ```

## Run Scripts

- **Create the database** <br>

  - Rename `.env.example` file to `.env`
  - Write your PostgreSQL user name and password in `.env`
  - Run the following commands to create two databases, one for development and one for testing <br>

    ```sh
    npm run create-dev-db
    ```

    ```sh
    npm run create-test-db
    ```

- Build the project

  ```sh
  npm run build
  ```

- Migrate Database

  ```sh
  npm run migrate-dev-up
  ```

- Run the project

  ```sh
  npm run start
  ```

- Run tests

  ```sh
  npm run test
  ```

---

## Endpoints

- Full API Documentation:
  [Go to the Documentation Page](https://documenter.getpostman.com/view/14046968/UyxjFmBM#65ae3ab3-93b2-4b06-8b73-ebe5079bc80b)

- HomePage:

  ```sh
  http://localhost:3000/
  ```

- Users:
  ```sh
  http://localhost:3000/users
  ```
- Products:
  ```sh
  http://localhost:3000/products
  ```
- Orders:

  ```sh
  http://localhost:3000/orders
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
