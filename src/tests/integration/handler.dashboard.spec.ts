import { Product, ProductStore } from '../../models/product';
import { User, UserModel } from '../../models/user';
import { Order, OrderStore } from '../../models/order';

import { app, server as mainServer } from '../../server';
import { agent as _request } from 'supertest';
import Client from '../../startup/database';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const request = _request(app);
const tokenSecret = String(process.env.TOKEN_SECRET);

describe('handlers/dashboard integration test suite', () => {
  let server: { close: () => any };

  const productStore = new ProductStore();
  const orderStore = new OrderStore();
  const userModel = new UserModel();

  beforeEach(() => {
    server = mainServer;
  });

  afterAll(async () => {
    await server.close();
  });

  describe(' /dashboard', () => {
    let token: string;
    let admin: User;
    let order: Order;
    let product_ids: number[] = [];

    beforeAll(async () => {
      for (let i = 1; i < 10; i++) {
        let tempProduct: Product = (await productStore.create({
          name: `product${i} name`,
          price: i * 10,
          category: `product${i} category`,
        })) as Product;

        product_ids.push(tempProduct.id as number);
      }

      admin = {
        first_name: 'handlerDAdmin first name',
        last_name: 'handlerDAdmin last name',
        email: 'handlerDAdminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      admin = (await userModel.create(admin)) as User;

      order = {
        status: 'Pending',
        user_id: Number(admin.id),
      };

      order = (await orderStore.create(order)) as Order;

      token = jwt.sign(admin, tokenSecret);
    });

    afterAll(async () => {
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

    it('should index Five most popular products and return 200', async () => {
      for (let i = 0; i < 7; i++) {
        await orderStore.addProductToCart(
          Number(order.id),
          Number(product_ids[i]),
          i + 5
        );
      }
      const res = await request.get('/dashboard/five-most-popular');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.length).toBe(5);
    });

    it('should index Five most expensive products and return 200', async () => {
      const res = await request.get('/dashboard/five-most-expensive');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.length).toBe(5);
    });

    it('should filter products by category and return 200', async () => {
      const res = await request.get('/dashboard/filter/product3 category');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].name).toBe('product3 name');
    });

    it('should index users with orders and return 200', async () => {
      const res = await request
        .get('/dashboard/users-with-orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].first_name).toBe(admin.first_name);
    });

    it('should index products in orders and return 200', async () => {
      const res = await request
        .get('/dashboard/products_in_orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body[0].name).toBe('product1 name');
    });
  });
});
