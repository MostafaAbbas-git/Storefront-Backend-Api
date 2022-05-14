import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.get('/orders/mine/:id', getProductsInOrder);
  app.post('/orders', create);
  app.delete('/orders', destroy);
  app.post('/orders/:id/products', addProductToOrder);
};

const store = new OrderStore();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (_req: Request, res: Response) => {
  const order = await store.show(_req.body.id);
  res.json(order);
};

const create = async (_req: Request, res: Response) => {
  try {
    const order: Order = {
      status: _req.body.status,
      user_id: _req.body.user_id,
    };

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProductToOrder = async (
  _req: Request,
  res: Response
): Promise<Order | unknown> => {
  const orderId: number = Number(_req.params.id);
  const productId: number = Number(_req.body.productId);
  const quantity: number = Number(_req.body.quantity);

  try {
    // if result == true, that means there's an order with given id in order_products table
    const result = await store.checkOrder(orderId);
    if (!result) {
      // create the order first
    }
    // update that order row in the database with new added product
    try {
      const addedProduct = await store.addProduct(quantity, orderId, productId);
      res.json(addedProduct);
    } catch (error) {
      throw new Error(`could not add product. Error: ${error}`);
    }
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

const getProductsInOrder = async (_req: Request, res: Response) => {
  const orderId: number = Number(_req.params.id);

  try {
    const resultObj = await store.getProductsInOrder(orderId);
    res.json(resultObj);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
};

export default orderRoutes;
