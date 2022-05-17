import { User, UserModel } from '../../models/user';
import Client from '../../startup/database';
import { agent as _request } from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server as mainServer } from '../../server';
import dotenv from 'dotenv';

dotenv.config();
describe('handlers/users integration test suite', () => {
  let server: { close: () => any };

  const userModel = new UserModel();
  const tokenSecret = String(process.env.TOKEN_SECRET);
  const request = _request(app);

  beforeEach(() => {
    server = mainServer;
  });

  afterEach(async () => {
    try {
      const conn = await Client.connect();
      const sql = 'TRUNCATE TABLE users cascade';

      await conn.query(sql);

      conn.release();
    } catch (error) {
      throw new Error(`Unable to Truncate users table. ${error}`);
    }
  });

  afterAll(async () => {
    await server.close();
  });

  describe('GET /users', () => {
    let user: User;
    let admin: User;
    let token: string;

    beforeEach(() => {
      user = {
        first_name: 'first name',
        last_name: 'last name',
        email: 'useremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      admin = {
        first_name: 'admin first name',
        last_name: 'admin last name',
        email: 'adminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      token = jwt.sign(admin, tokenSecret);
    });

    it('should index all users', async () => {
      await userModel.create(user);
      const adminCreated = await userModel.create(admin);

      const res = await request
        .get('/users/index')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(adminCreated).toBeInstanceOf(Object);
      expect(
        res.body.some((u: User) => u.email === 'adminemail@gmail.com')
      ).toBeTruthy();
    });

    it('should return 401 access denied for index all users as basic user', async () => {
      await userModel.create(user);
      await userModel.create(admin);

      token = jwt.sign(user, tokenSecret);
      const res = await request
        .get('/users/index')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
    });
  });
});
