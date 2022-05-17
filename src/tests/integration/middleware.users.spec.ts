import {
  validateUserInputsMiddleware,
  authMiddleware,
  adminMiddleware,
} from '../../middleware/users.middleware';

import { UserModel, User } from '../../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { app, server as mainServer } from '../../server';
import { agent as _request } from 'supertest';

dotenv.config();

describe('/middleware/users test suite', () => {
  let server: { close: () => any };
  const request = _request(app);

  const userModel = new UserModel();
  const tokenSecret = String(process.env.TOKEN_SECRET);

  beforeEach(() => {
    server = mainServer;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('Check the definition of all methods', () => {
    it('should be defined for validateUserInputsMiddleware method', () => {
      expect(validateUserInputsMiddleware).toBeDefined();
    });

    it('should be defined for authMiddleware method', () => {
      expect(authMiddleware).toBeDefined();
    });

    it('should be defined for adminMiddleware method', () => {
      expect(adminMiddleware).toBeDefined();
    });
  });

  describe('Check returns of all methods associated with users middleware', () => {
    let user: User;
    let admin: User;
    let token: string;

    beforeEach(async () => {
      user = {
        first_name: 'middlewareUser first name',
        last_name: 'middlewareUser last name',
        email: 'middlewareUseremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      admin = {
        first_name: 'middlewareAdmin first name',
        last_name: 'middlewareAdmin last name',
        email: 'middlewareAdminemail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      user = (await userModel.create(user)) as User;
      admin = (await userModel.create(admin)) as User;

      token = jwt.sign(user, tokenSecret);
    });

    afterEach(async () => {
      await userModel.delete(Number(user.id));
      await userModel.delete(Number(admin.id));
    });

    it('should return statusCode 400 with error message for invalid user inputs for authentication', async () => {
      const res = await request.post('/users/authenticate').send({
        email: user.email,
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Missing required fields');
    });

    it('should return statusCode 400 with error message for trying to access my profile with providing invalid token', async () => {
      const res = await request
        .get('/users/myProfile')
        .set('Authorization', 'Bearer x');
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Invalid token');
    });

    it('should return statusCode 401 with error message for trying to access admin endpoint', async () => {
      const res = await request
        .get('/users/index')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(401);
      expect(res.body.Error).toContain('Access denied. Unauthorized');
    });
  });
});
