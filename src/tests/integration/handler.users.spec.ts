import { User, UserModel } from '../../models/user';

import { app, server as mainServer } from '../../server';
import { agent as _request } from 'supertest';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const tokenSecret = String(process.env.TOKEN_SECRET);

const request = _request(app);

describe('handlers/users integration test suite', () => {
  let server: { close: () => any };

  const userModel = new UserModel();

  beforeEach(() => {
    server = mainServer;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('/users', () => {
    let user: User;
    let admin: User;
    let token: string;

    beforeEach(async () => {
      user = {
        first_name: 'handlerUser first name',
        last_name: 'handlerUser last name',
        email: 'handlerUseremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      admin = {
        first_name: 'handlerAdmin first name',
        last_name: 'handlerAdmin last name',
        email: 'handlerAdminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      admin = (await userModel.create(admin)) as User;

      token = jwt.sign(admin, tokenSecret);
    });

    afterEach(async () => {
      await userModel.delete(Number(admin.id));
    });

    it('should index all users', async () => {
      const res = await request
        .get('/users/index')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);

      expect(res.body[0].email).toBe('handlerAdminemail@gmail.com');
    });

    it('should show one user by its id', async () => {
      const res = await request
        .get(`/users/show/${admin.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('handlerAdminemail@gmail.com');
    });

    it('should show loggeed-in user data', async () => {
      const res = await request
        .get('/users/myProfile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('handlerAdminemail@gmail.com');
    });

    it('should change user role', async () => {
      const res = await request
        .patch('/users/role')
        .set('Authorization', `Bearer ${token}`)
        .send({
          user_role: 0,
          email: admin.email,
        });

      expect(res.status).toBe(200);
      expect(res.body.updatedUser.email).toBe('handlerAdminemail@gmail.com');
      expect(res.body.updatedUser.user_role).toBe(0);
    });

    it('should delete user and return it', async () => {
      user = (await userModel.create(user)) as User;

      const res = await request
        .delete('/users/delete')
        .set('Authorization', `Bearer ${token}`)
        .send({
          userId: user.id,
        });

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
    });

    it('should create new user and return it', async () => {
      const res = await request.post('/users').send(user);

      expect(res.status).toBe(200);
      expect(res.body.email).toBe(user.email);
      // delete
      await userModel.delete(Number(res.body.id));
    });

    it('should authenticate user and return JWT token', async () => {
      // prettier-ignore
      const res = await request
        .post('/users/authenticate')
        .send({
          email: admin.email,
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.text).toBeInstanceOf(String);
    });

    it('should update logged-in user data', async () => {
      const newFirstName: string = 'my new first name';
      const newUser: User = {
        email: admin.email,
        password: 'password123',
        first_name: newFirstName,
      };
      const res = await request
        .patch('/users/myProfile')
        .set('Authorization', `Bearer ${token}`)
        .send(newUser);

      expect(res.status).toBe(200);
      expect(res.body.updatedUser.email).toBe(admin.email);
      expect(res.body.updatedUser.first_name).toBe('my new first name');
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
