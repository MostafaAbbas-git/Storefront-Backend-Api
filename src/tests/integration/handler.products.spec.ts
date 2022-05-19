import { Product, ProductStore } from '../../models/product';
import { User, UserModel } from '../../models/user';

import { app, server as mainServer } from '../../server';
import Client from '../../startup/database';
import { agent as _request } from 'supertest';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const request = _request(app);
const tokenSecret = String(process.env.TOKEN_SECRET);

describe('handlers/orders integration test suite', () => {
  let server: { close: () => any };

  const productStore = new ProductStore();
  const userModel = new UserModel();

  beforeEach(() => {
    server = mainServer;
  });

  afterAll(async () => {
    await server.close();
  });

  describe(' /products', () => {
    let product1: Product;
    let product2: Product;
    let token: string;
    let admin: User;

    beforeAll(async () => {
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

      admin = {
        first_name: 'handlerPAdmin first name',
        last_name: 'handlerPAdmin last name',
        email: 'handlerPAdminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      product1 = (await productStore.create(product1)) as Product;
      admin = (await userModel.create(admin)) as User;

      token = jwt.sign(admin, tokenSecret);
    });

    afterAll(async () => {
      await userModel.delete(Number(admin.id));
      await productStore.delete(Number(product1.id));
    });

    it('should index all products and return 200', async () => {
      const res = await request.get('/products');

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body[0].name).toBe(product1.name);
    });

    it('should show one product by its id', async () => {
      const res = await request.get(`/products/${product1.id}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.name).toBe(product1.name);
    });

    it('should create new product and return it with statusCode: 200', async () => {
      const res = await request
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send(product2);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.name).toBe(product2.name);
      await productStore.delete(Number(res.body.id));
    });

    it('should delete product by its id and return it with statusCode: 200', async () => {
      product2 = (await productStore.create(product2)) as Product;

      const res = await request
        .delete(`/products/${product2.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.name).toBe(product2.name);
    });
  });
});
