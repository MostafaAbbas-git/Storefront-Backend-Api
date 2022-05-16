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

1. Install the requirements and dependancies\

   ```sh
   npm install
   ```

## Run Scripts

- Build the project

  ```sh
  npm run build
  ```

- Create Database

  ```sh
  npm run create-db
  ```

  **PS**: To create a new database using the existing configurations, you have to create a new PostgreSQL user with name: {storeuser}, password: {password123}.<br>
  _Or_ <br>
  modify `.env` file with your PostgreSQL username and password, then create a new database using the commands mentioned above.
  <br><br/>

- Migrate Database

  ```sh
  npm run migrate-up
  ```

- Run the project

  ```sh
  npm run start
  ```

- Run tests\
   _PS:_ Running this scipt will build the project first, and then it will run jasmine test script.
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
