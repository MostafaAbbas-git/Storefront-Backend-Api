import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

import { validateProductInputsMiddleware } from '../middleware/products.middleware';

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', validateProductInputsMiddleware, create);
  app.delete('/products/:id', destroy);
};

const store = new ProductStore();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (_req: Request, res: Response) => {
  const product = await store.show(Number(_req.params.id));
  res.json(product);
};

const create = async (_req: Request, res: Response) => {
  try {
    const product: Product = {
      name: _req.body.name,
      price: _req.body.price,
      category: _req.body.category,
    };

    const newProduct = await store.create(product);

    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (_req: Request, res: Response) => {
  try {
    const deleted = await store.delete(Number(_req.params.id));
    res.json(deleted);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
};

export default productRoutes;
