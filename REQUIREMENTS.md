# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- A INDEX route: 'products' [GET]
- A SHOW route: 'products/:id' [GET]
- A CREATE route: 'products' [POST] [token required] [accessible by admin only]
- A DELETE route: '/products/:id' [DELETE] [token required] [accessible by admin only] <br>
  **DASHBOARD ROUTES**: <br>
- index Products By Category route: '/dashboard/filter/:category' <br>
- index five Most Popular Products route: '/dashboard/five-most-popular' <br>
- index five Most Expensive Products route: '/dashboard/five-most-expensive' <br>

#### Users

- A INDEX route: 'users/index' [GET] [token required] [accessible by admin only] <br>
- A SHOW route: 'users/show' [GET] [token required] [accessible by admin only] <br>
- A DELETE route: 'users/delete' [DELETE] [token required] [accessible by admin only] <br>
- A PATCH route: 'users/role' [PATCH] [token required] [accessible by admin only] <br>
- A SHOW route: 'users/myProfile' [GET] [token required] <br>
- A CREATE route: 'users' [POST] <br>
- A AUTHENTICATE route: 'users/authenticate' [POST] <br>
- A UPDATE route: 'users/myProfile' [PATCH] [token required] <br>

**DASHBOARD ROUTES**: <br>

- index Users with Orders route: 'dashboard/users-with-orders' [GET] [token required] [accessible by admin only] <br>
- index Products In Orders route: 'dashboard/products_in_orders' [GET] [token required] [accessible by admin only] <br>

#### Orders

- A INDEX route: 'orders' [GET] [token required] [accessible by admin only] <br>
- A INDEX all pending carts route: 'orders/pending-carts' [GET] [token required] [accessible by admin only] <br>
- A INDEX all active carts route: 'orders/active-carts' [GET] [token required] [accessible by admin only] <br>
- A SHOW route: 'orders/show-one' [GET] [token required] [accessible by admin only] <br>

- A CREATE route: 'orders' [POST] [token required] <br>
- A ADD to Cart route: 'orders/add-to-cart' [POST] [token required] <br>
- A REMOVE from Cart route: 'orders/mycart/removeProduct' [PATCH] [token required] <br>
- A DELETE my order route: 'orders/delete' [DELETE] [token required] <br>
- A INDEX my cart route: 'orders/mycart' [GET] [token required] <br>
- A SHOW one of my orders route: 'orders/myorders/show-one' [GET] [token required] <br>
- A INDEX ALL my orders route: 'orders/myorders/show-all' [GET] [token required] <br>
- A SUBMIT order route: '/orders/submit' [PATCH] [token required] <br>
- A SHOW my pending order route: 'orders/myorders/my-pending-order' [GET] [token required] <br>

## Data Shapes

#### Product

- id: number
- name: string
- price: number
- category: string

#### User

- id: number
- firstName: string
- lastName: string
- email: string
- password: string
- user_role: number

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)
