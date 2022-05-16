import { OrderStore } from '../../models/order';
import { User, UserModel } from '../../models/user';
import Client from '../../database';
import { agent as _request } from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server as mainServer } from '../../server';

describe('handlers/orders integration test suite', () => {
  let server: { close: () => any };

  const store = new OrderStore();
  const userModel = new UserModel();

  const tokenSecret = String(process.env.TOKEN_SECRET);
  const request = _request(app);

  beforeEach(() => {
    server = mainServer;
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      const sql = 'TRUNCATE TABLE orders cascade; TRUNCATE TABLE users cascade';

      await conn.query(sql);

      conn.release();
    } catch (error) {
      throw new Error(`Unable to Truncate users table. ${error}`);
    }
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /orders', () => {
    let user: User;
    let token: string;

    beforeEach(() => {
      user = {
        first_name: 'first name',
        last_name: 'last name',
        email: 'useremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      token = jwt.sign(user, tokenSecret);
    });

    it('should return 403 access denied for index all active carts as basic user', async () => {
      const createdUser = await userModel.create(user);
      token = jwt.sign(createdUser, tokenSecret);

      const res = await request
        .get('/orders/active-carts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
    });
  });

  describe('POST /orders', () => {
    let user: User;
    let token: string;

    beforeEach(() => {
      user = {
        first_name: 'first name',
        last_name: 'last name',
        email: 'useremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      token = jwt.sign(user, tokenSecret);
    });

    it('should create empty order and return 200 with created order', async () => {
      const createdUser = await userModel.create(user);

      token = jwt.sign(createdUser, tokenSecret);

      const res = await request
        .post('/orders')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.order).toBeInstanceOf(Object);
    });
  });
});
