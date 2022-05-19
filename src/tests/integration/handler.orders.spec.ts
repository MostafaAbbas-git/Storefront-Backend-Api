import { Product, ProductStore } from '../../models/product';
import { User, UserModel } from '../../models/user';
import { Order, OrderStore, Order_Product } from '../../models/order';

import { app, server as mainServer } from '../../server';
import Client from '../../startup/database';
import { agent as _request } from 'supertest';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenSecret = String(process.env.TOKEN_SECRET);
const request = _request(app);

describe('handlers/orders integration test suite', () => {
  let server: { close: () => any };

  const orderStore = new OrderStore();
  const productStore = new ProductStore();
  const userModel = new UserModel();

  beforeEach(() => {
    server = mainServer;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('/orders', () => {
    let user: User;
    let admin: User;
    let token: string;
    let order: Order;
    let product: Product;

    beforeEach(async () => {
      user = {
        first_name: 'handlerOUser first name',
        last_name: 'handlerOUser last name',
        email: 'handlerOUseremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      admin = {
        first_name: 'handlerOAdmin first name',
        last_name: 'handlerOAdmin last name',
        email: 'handlerOAdminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      product = {
        name: 'product name',
        price: 10,
        category: 'product category',
      };

      product = (await productStore.create(product)) as Product;

      admin = (await userModel.create(admin)) as User;

      order = {
        status: 'Pending',
        user_id: Number(admin.id),
      };

      order = (await orderStore.create(order)) as Order;

      token = jwt.sign(admin, tokenSecret);
    });

    afterEach(async () => {
      try {
        const conn = await Client.connect();
        const sql =
          'TRUNCATE TABLE order_products cascade; TRUNCATE TABLE products cascade; TRUNCATE TABLE orders cascade; TRUNCATE TABLE users cascade';

        await conn.query(sql);

        conn.release();
      } catch (error) {
        throw new Error(`Unable to Truncate users table. ${error}`);
      }
    });

    it('should index all orders', async () => {
      const res = await request
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].user_id).toBe(`${admin.id}`);
    });

    it('should index all pending carts', async () => {
      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );

      const res = await request
        .get('/orders/pending-carts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].user_id).toBe(`${admin.id}`);
      expect(res.body[0].status).toBe('Pending');
    });

    it('should index all active carts', async () => {
      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );

      order = (await orderStore.updateOrderStatus(
        Number(order.id),
        'Active'
      )) as Order;

      const res = await request
        .get('/orders/active-carts')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].user_id).toBe(`${admin.id}`);
      expect(res.body[0].status).toBe('Active');
    });

    it('should show one order by user_id and order_id', async () => {
      const res = await request
        .get(`/orders/show-one/${order.id}/${admin.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.user_id).toBe(`${admin.id}`);
    });

    it('should index logged in user cart', async () => {
      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );

      const res = await request
        .get('/orders/mycart')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].product_id).toBe(`${product.id}`);
    });

    it('should show logged in user pending order', async () => {
      const res = await request
        .get('/orders/myorders/my-pending-order')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.user_id).toBe(`${admin.id}`);
      expect(res.body.status).toBe('Pending');
    });

    it('should show one of private logged-in user orders by its id', async () => {
      const res = await request
        .get(`/orders/myorders/show-one/${order.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.user_id).toBe(`${admin.id}`);
      expect(res.body.status).toBe('Pending');
    });

    it('should index all of private logged-in user orders', async () => {
      const res = await request
        .get('/orders/myorders/show-all')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].user_id).toBe(`${admin.id}`);
    });

    it('should create new order with Pending status for logged-in user', async () => {
      user = (await userModel.create(user)) as User;
      token = jwt.sign(user, tokenSecret);
      const res = await request
        .post('/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.msg).toContain('Your order is almost ready');
      expect(res.body.order.user_id).toBe(`${user.id}`);
    });

    it('should add product to cart and return the added product with its quantity', async () => {
      const res = await request
        .post('/orders/add-to-cart')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: Number(product.id),
          quantity: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.order_id).toBe(`${order.id}`);
      expect(res.body.product_id).toBe(`${product.id}`);
    });

    it('should submit logged in user Pending order and return it with Active status', async () => {
      const res = await request
        .patch('/orders/submit')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.status).toBe('Active');
      expect(res.body.user_id).toBe(`${admin.id}`);
    });

    it('should remove product from cart and return the removed product', async () => {
      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );

      const res = await request
        .patch('/orders/mycart/removeProduct')
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: Number(product.id),
        });

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.order_id).toBe(`${order.id}`);
      expect(res.body.product_id).toBe(`${product.id}`);
    });

    it('should delete my pending order and return it', async () => {
      const res = await request
        .delete('/orders/delete')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.status).toBe('Pending');
    });
  });
});
