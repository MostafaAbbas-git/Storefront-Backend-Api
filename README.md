# Storefront-Backend-Api

This is an E-commerce API that...

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

- Run the project

  ```sh
  npm run start
  or
  node dist/index.js
  ```

  **PS**: Write your note here
  <br><br/>

- Run tests\
   _PS:_ Running this scipt will build the project first, and then it will run jasmine test script.
  ```sh
  npm run test
  ```

---

## Endpoints

- HomePage: http://localhost:3000/api

- Processing images: http://localhost:3000/api/images

- Required query parameters:
  ```sh
  api/images?filename={image_name}&width={new_width}&height={new_height}
  ```

## Author

- Mostafa M. Abbas- (https://github.com/MostafaAbbas-git)
- Udacity email: mostafa.abdelsadek99@eng-st.cu.edu.eg

## About

This project is a part of Advanced Full-Stack Web Development Nanodegree Program by Udacity and FWD.\
Instructor: Mohamed Elshafeay
