import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';
import {
  authMiddleware,
  adminMiddleware,
} from '../middleware/users.middleware';

const dashboardRoutes = (app: express.Application) => {
  app.get(
    '/dashboard/products_in_orders',
    [authMiddleware, adminMiddleware],
    productsInOrders
  );
  app.get(
    '/dashboard/users-with-orders',
    [authMiddleware, adminMiddleware],
    usersWithOrders
  );
  app.get('/dashboard/five-most-expensive', fiveMostExpensive);
  app.get('/dashboard/five-most-popular', fiveMostPopular);
  app.get('/dashboard/filter/:category', indexProductsByCategory);
};

const dashboard = new DashboardQueries();

const fiveMostExpensive = async (
  _req: Request,
  res: Response
): Promise<Object | unknown> => {
  try {
    const users = await dashboard.fiveMostExpensiveProducts();
    res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

const productsInOrders = async (
  _req: Request,
  res: Response
): Promise<Object | unknown> => {
  try {
    const products = await dashboard.productsInOrders();
    res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

const usersWithOrders = async (
  _req: Request,
  res: Response
): Promise<Object | unknown> => {
  try {
    const users = await dashboard.usersWithOrders();
    res.json(users);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

const fiveMostPopular = async (
  _req: Request,
  res: Response
): Promise<Object | unknown> => {
  try {
    const products = await dashboard.fiveMostPopularProducts();
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

const indexProductsByCategory = async (
  _req: Request,
  res: Response
): Promise<Object | unknown> => {
  try {
    const category: string = _req.params.category;
    const products = await dashboard.indexProductsByCategory(category);
    res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};
export default dashboardRoutes;
