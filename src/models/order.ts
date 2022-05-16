// @ts-ignore
import Client from '../database';

export type Order = {
  id?: string;
  status: string;
  user_id: number;
};

export type Cart = {
  id: number;
  product_id: number;
  quantity: number;
};

export class OrderStore {
  async indexAllOrders(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders ';

      const result = await conn.query(sql);
      const orders = result.rows;

      conn.release();

      return orders;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }
  async indexMyOrders(user_id: number): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders WHERE user_id =($1)';

      const result = await conn.query(sql, [user_id]);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(orderId: number, userId: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1) AND user_id=($2)';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, userId]);
      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not find order ${orderId}. Error: ${err}`);
    }
  }

  async getPendingOrderByUserId(user_id: number): Promise<Order> {
    try {
      const orderStatus = 'Pending';
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';

      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [user_id, orderStatus]);
      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not find orders associated with user_id: ${user_id}. Error: ${err}`
      );
    }
  }
  async create(o: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [o.status, o.user_id]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add new order ${o.status}. Error: ${err}`);
    }
  }
  async addProductToCart(
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<Object | unknown | string> {
    try {
      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES($1, $2, $3) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, productId, quantity]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      console.error(err);
      return `Could not add product ${productId} to order ${orderId}`;
    }
  }

  async removeProductFromCart(
    orderId: number,
    productId: number
  ): Promise<Object | unknown> {
    try {
      const sql =
        'DELETE FROM order_products WHERE order_id=($1) AND product_id=($2) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, productId]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(
        `Could not remove product with id: (${productId}) from order with id: (${orderId}). Error: ${err}`
      );
    }
  }

  async updateOrderStatus(
    orderId: number,
    status: string
  ): Promise<Order | unknown> {
    try {
      const sql = 'UPDATE orders SET status=($1) WHERE id=($2) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [status, orderId]);
      const newOrderObj = result.rows[0];

      conn.release();

      return newOrderObj;
    } catch (err) {
      throw new Error(
        `Could not check for order with id ${orderId}. Error: ${err}`
      );
    }
  }

  async indexMyCart(userId: number): Promise<Cart[] | string> {
    try {
      const status: string = 'Pending';
      const sql =
        'SELECT orders.id, product_id, quantity FROM orders, order_products WHERE orders.id = order_products.order_id AND orders.status=($1) AND orders.user_id=($2);';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [status, userId]);

      const order = result.rows;
      conn.release();

      return order;
    } catch (err) {
      return `Could not get cart that belongs to ${userId}: ${err}`;
    }
  }

  async indexAllCarts(orderStatus: string): Promise<object[] | string> {
    try {
      const status: string = orderStatus;
      const sql =
        'SELECT orders.id, orders.user_id, orders.status, product_id, quantity FROM orders, order_products WHERE orders.id = order_products.order_id AND orders.status=($1);';

      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [status]);

      const order = result.rows;

      conn.release();

      return order;
    } catch (err) {
      console.error(err);
      return `Could not index all carts: ${err}`;
    }
  }

  async delete(orderId: number, userId: number): Promise<Order> {
    try {
      const sql =
        'DELETE FROM orders WHERE id=($1) AND user_id=($2) RETURNING *';
      // @ts-ignore
      const conn = await Client.connect();

      const result = await conn.query(sql, [orderId, userId]);
      if (result.rows.length == 0) {
        throw new Error(
          `Could not delete order with id: ${orderId}. Does not exist`
        );
      }
      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not delete order ${orderId}. Error: ${err}`);
    }
  }
}
