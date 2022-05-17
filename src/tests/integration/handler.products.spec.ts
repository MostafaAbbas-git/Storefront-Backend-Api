import { Product, ProductStore } from '../../models/product';
import { User, UserModel } from '../../models/user';
import Client from '../../startup/database';
import { agent as _request } from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server as mainServer } from '../../server';
import dotenv from 'dotenv';

dotenv.config();
describe('handlers/orders integration test suite', () => {
  let server: { close: () => any };

  const store = new ProductStore();
  const userModel = new UserModel();

  const tokenSecret = String(process.env.TOKEN_SECRET);
  const request = _request(app);

  beforeEach(() => {
    server = mainServer;
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      const sql =
        'TRUNCATE TABLE products cascade; TRUNCATE TABLE users cascade';

      await conn.query(sql);

      conn.release();
    } catch (error) {
      throw new Error(`Unable to Truncate users table. ${error}`);
    }
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /products', () => {
    let product1: Product;
    let product2: Product;

    beforeEach(() => {
      product1 = {
        name: 'product1',
        price: 100,
        category: 'category1',
      };

      product2 = {
        name: 'product2',
        price: 200,
        category: 'category2',
      };
    });

    it('should index all products and return 200', async () => {
      await store.create(product1);
      await store.create(product2);

      const res = await request.get('/products');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.some((p: Product) => p.name === 'product1')).toBeTruthy();
    });
  });

  describe('POST /products', () => {
    let admin: User;
    let product1: Product;

    beforeEach(() => {
      product1 = {
        name: 'product1',
        price: 100,
        category: 'category1',
      };

      admin = {
        first_name: 'admin first name',
        last_name: 'admin last name',
        email: 'adminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };
    });

    it('should return 200 with created product', async () => {
      const createdUser = await userModel.create(admin);

      const token: string = jwt.sign(createdUser, tokenSecret);

      const res = await request
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product1);

      expect(res.status).toBe(200);
      expect(res.body.category).toBeInstanceOf(String);
    });
  });
});
