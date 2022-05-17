/* eslint-disable indent */
import Client from '../startup/database';

export class DashboardQueries {
  async productsInOrders(): Promise<
    { name: string; price: number; order_id: string }[]
    // eslint-disable-next-line indent
  > {
    // Get all products that have been included in orders
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        'SELECT name, price, order_id FROM products INNER JOIN order_products ON products.id = order_products.product_id';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products and orders: ${err}`);
    }
  }

  async usersWithOrders(): Promise<
    { firstName: string; lastName: string; orderId: number }[]
  > {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        'SELECT first_name, last_name, orders.id AS order_id FROM users INNER JOIN orders ON users.id = orders.user_id';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users with orders: ${err}`);
    }
  }

  async fiveMostExpensiveProducts(): Promise<
    { name: string; price: number }[]
  > {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        'SELECT name, price FROM products ORDER BY price DESC LIMIT 5';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get products by price: ${err}`);
    }
  }

  async fiveMostPopularProducts(): Promise<
    { product_id: number; value_occurrence: number }[]
    // eslint-disable-next-line indent
  > {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        'SELECT product_id, COUNT(product_id) AS value_occurrence FROM order_products GROUP BY product_id ORDER BY value_occurrence DESC LIMIT 5';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('unable get fiveMostPopularProducts');
    }
  }

  async indexProductsByCategory(category: string): Promise<Object[] | unknown> {
    try {
      //@ts-ignore
      const conn = await Client.connect();
      const sql =
        'SELECT * FROM products WHERE category=($1) ORDER BY products.id ASC';

      const result = await conn.query(sql, [category]);

      conn.release();

      return result.rows;
    } catch (err) {
      console.error(err);
      throw new Error('unable indexProductsByCategory');
    }
  }
}
