import express, { Request, Response } from 'express';
import { Order, OrderStore, Cart } from '../models/order';
import {
  authMiddleware,
  adminMiddleware,
} from '../middleware/users.middleware';

const orderRoutes = (app: express.Application) => {
  // Admin endpoints
  app.get('/orders', [authMiddleware, adminMiddleware], indexAllOrders);
  app.get('/orders/show-one', [authMiddleware, adminMiddleware], showOneOrder);
  app.get(
    '/orders/pending-carts',
    [authMiddleware, adminMiddleware],
    indexAllPendingCarts
  );
  app.get(
    '/orders/active-carts',
    [authMiddleware, adminMiddleware],
    indexAllActiveCarts
  );

  // User endpoints
  app.get('/orders/myorders/show-one', authMiddleware, showOneOfMyOrders);
  app.get('/orders/myorders/show-all', authMiddleware, showAllMyOrders);
  app.get(
    '/orders/myorders/my-pending-order',
    authMiddleware,
    showMyPendingOrder
  );
  app.get('/orders/mycart', authMiddleware, indexMyCart);

  app.post('/orders', authMiddleware, create);
  app.post('/orders/add-to-cart', authMiddleware, addProductToCart);

  app.delete('/orders/delete', authMiddleware, destroy);
  app.patch(
    '/orders/mycart/removeProduct',
    authMiddleware,
    removeProductFromCart
  );

  app.patch('/orders/submit/:orderId', authMiddleware, submitMyOrder);
};

const store = new OrderStore();

const indexAllOrders = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const orders = await store.indexAllOrders();
    if (orders.length == 0) {
      return res.status(404).json({ Error: 'No orders found' });
    }
    res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const indexAllPendingCarts = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const status: string = 'Pending';
    const orders = await store.indexAllCarts(status);
    if (orders.length == 0) {
      return res.status(404).json({ Error: 'No pending carts found' });
    }
    res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json(err);
  }
};
const indexAllActiveCarts = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const status: string = 'Active';
    const orders = await store.indexAllCarts(status);
    if (orders.length == 0) {
      return res.status(404).json({ Error: 'No active carts found' });
    }
    res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showAllMyOrders = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  // show all my orders
  try {
    const userId: number = Number(_req.user.id);

    const orders = await store.indexMyOrders(userId);

    if (orders.length == 0) {
      return res
        .status(404)
        .json({ Error: `No orders found associated with user_id: ${userId}.` });
    }
    res.status(200).json(orders);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showOneOfMyOrders = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  // show one of my orders
  try {
    const orderId: number = Number(_req.body.orderId);
    const userId: number = Number(_req.user.id);

    const order = await store.show(orderId, userId);

    if (Object.keys(order).length == 0) {
      return res
        .status(404)
        .json({ Error: `No order found with orderId: ${orderId}.` });
    }
    res.status(200).json(order);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showOneOrder = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  // show any specific order (as admin)
  try {
    const orderId: number = Number(_req.body.orderId);
    const userId: number = Number(_req.body.userId);

    const order = await store.show(orderId, userId);

    if (Object.keys(order).length == 0) {
      return res
        .status(404)
        .json({ Error: `No order found with orderId: ${orderId}.` });
    }
    res.status(200).json(order);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showMyPendingOrder = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const user_id: number = Number(_req.user.id);

    const order: Order = await store.getPendingOrderByUserId(user_id);
    res.json(order);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const indexMyCart = async (_req: Request, res: Response) => {
  const userId: number = Number(_req.user.id);

  try {
    const myCart = await store.indexMyCart(userId);
    if (Object.keys(myCart).length == 0) {
      return res
        .status(404)
        .json({ Error: 'Your cart is empty. start adding products now!.' });
    }
    res.json(myCart);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

const create = async (_req: Request, res: Response) => {
  const user_id = _req.user.id as number;

  try {
    const order = await store.getPendingOrderByUserId(user_id);
    if (typeof order !== 'undefined') {
      return res.json(
        'You already have a pending order in the store. Submit your order before creating a new one'
      );
    }
  } catch (error) {
    throw new Error(`${error}`);
  }
  try {
    // current logged in user_id

    const order: Order = {
      status: 'Pending',
      user_id,
    };

    const newOrder = await store.create(order);
    res.json({
      msg: 'Your order is almost ready!, start adding your favorite products to your cart.',
      order: newOrder,
    });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const submitMyOrder = async (
  _req: Request,
  res: Response
): Promise<Order | unknown> => {
  const orderId: number = Number(_req.params.orderId);
  const userId: number = Number(_req.user.id);
  const status: string = 'Active';

  // check if the order is already Active
  try {
    const fetchedOrder = await store.show(orderId, userId);
    if (fetchedOrder.status == 'Active') {
      return res
        .status(400)
        .json({ msg: `Order with id ${orderId} is already active.` });
    }

    const order = await store.updateOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

const addProductToCart = async (
  _req: Request,
  res: Response
): Promise<Order | unknown> => {
  const productId: number = Number(_req.body.productId);
  const quantity: number = Number(_req.body.quantity);

  const userId: number = Number(_req.user.id);

  try {
    // get orderId from the current pending order associated with current active user id
    const pendingOrder = await store.getPendingOrderByUserId(userId);

    // Return if there is no pending order
    if (typeof pendingOrder === 'undefined') {
      return res.status(404).json({
        Error:
          'No order found. You have to create a new order before adding a product.',
      });
    }
    const orderId: number = Number(pendingOrder.id);
    const addedProduct = await store.addProductToCart(
      orderId,
      productId,
      quantity
    );
    res.json(addedProduct);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

const removeProductFromCart = async (_req: Request, res: Response) => {
  const productId: number = Number(_req.body.productId);
  const userId: number = Number(_req.user.id);
  let orderId: number;
  let productExistenceFlag: Boolean = false;
  try {
    // get orderId from the MyCart
    const myCart = (await store.indexMyCart(userId)) as Cart[];

    // return if myCart is empty
    if (Object.keys(myCart).length == 0) {
      return res.status(400).json({ Error: 'Your cart is empty.' });
    } else {
      orderId = Number(myCart[0].id);
    }

    // Check for the existence of the product in the cart
    myCart.forEach((element) => {
      if (element.product_id == productId) {
        productExistenceFlag = true;
      }
    });

    if (!productExistenceFlag) {
      return res.status(404).json({
        Error: `Product with id ${productId} not found in your Cart.`,
      });
    }

    const removedProduct = await store.removeProductFromCart(
      orderId,
      productId
    );

    res.status(200).json(removedProduct);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

async function clearOrder(orderId: number, cart: Cart[]) {
  for (const item of cart) {
    const product_id: number = Number(item.product_id);
    await store.removeProductFromCart(orderId, product_id);
  }
}

const destroy = async (_req: Request, res: Response) => {
  const userId: number = Number(_req.user.id);

  try {
    // get orderId from the current pending order associated with current active user id
    const pendingOrder = await store.getPendingOrderByUserId(userId);

    // Return if there is no pending order
    if (typeof pendingOrder === 'undefined') {
      return res
        .status(404)
        .json({ Error: 'No pending order found to delete.' });
    }

    const orderId: number = Number(pendingOrder.id);
    // Clear the cart before deleting the order
    const myCart = await store.indexMyCart(userId);

    await clearOrder(orderId, myCart as Cart[]);

    // delete the empty pending order
    const deletedOrder = await store.delete(orderId, userId);

    res.status(200).json(deletedOrder);
  } catch (err) {
    console.error(err);
    return res.status(400).send(err);
  }
};

export default orderRoutes;
