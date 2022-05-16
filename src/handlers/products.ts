import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

import { validateProductInputsMiddleware } from '../middleware/products.middleware';
import {
  authMiddleware,
  adminMiddleware,
} from '../middleware/users.middleware';

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post(
    '/products',
    [authMiddleware, adminMiddleware, validateProductInputsMiddleware],
    create
  );
  app.delete('/products/:id', [authMiddleware, adminMiddleware], destroy);
};

const store = new ProductStore();

const index = async (_req: Request, res: Response): Promise<void | unknown> => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const show = async (_req: Request, res: Response): Promise<void | unknown> => {
  try {
    const product = await store.show(Number(_req.params.id));
    res.json(product);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const create = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const product: Product = {
      name: _req.body.name,
      price: _req.body.price,
      category: _req.body.category,
    };

    const newProduct = await store.create(product);

    res.json(newProduct);
  } catch (err) {
    return res.status(400).json(err);
  }
};
const destroy = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const deleted = await store.delete(Number(_req.params.id));
    res.json(deleted);
  } catch (err) {
    return res.status(400).json(err);
  }
};

export default productRoutes;
