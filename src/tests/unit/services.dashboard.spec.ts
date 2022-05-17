import { ProductStore, Product } from '../../models/product';
import { OrderStore, Order, Order_Product, Cart } from '../../models/order';
import { UserModel, User } from '../../models/user';

import { DashboardQueries } from '../../services/dashboard';

const orderStore = new OrderStore();
const productStore = new ProductStore();
const userModel = new UserModel();

const dashboard = new DashboardQueries();

describe('/services/dashboard unit test suite', () => {
  describe('Check the definition of all methods', () => {
    it('should be defined for productsInOrders method', () => {
      expect(dashboard.productsInOrders).toBeDefined();
    });

    it('should be defined for usersWithOrders method', () => {
      expect(dashboard.usersWithOrders).toBeDefined();
    });

    it('should be defined for fiveMostExpensiveProducts method', () => {
      expect(dashboard.fiveMostExpensiveProducts).toBeDefined();
    });

    it('should be defined for fiveMostPopularProducts method', () => {
      expect(dashboard.fiveMostPopularProducts).toBeDefined();
    });

    it('should be defined for indexProductsByCategory method', () => {
      expect(dashboard.indexProductsByCategory).toBeDefined();
    });
  });

  describe('Check returns of all methods associated with dashboard service', () => {
    let user: User;
    let order: Order;
    let addedProductInCart: Order_Product;
    let product_ids: number[] = [];

    beforeAll(async () => {
      for (let i = 1; i < 10; i++) {
        const tempProduct: Product = (await productStore.create({
          name: `product${i} name`,
          price: i * 10,
          category: `product${i} category`,
        })) as Product;

        product_ids.push(tempProduct.id as number);
      }
    });

    afterAll(async () => {
      // delete products
      for (let i = 1; i < 10; i++) {
        await productStore.delete(product_ids[i - 1] as number);
      }
    });

    beforeEach(async () => {
      user = {
        first_name: 'Dashboarduser first name',
        last_name: 'user last name',
        email: 'useremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      // create user
      user = (await userModel.create(user)) as User;

      order = {
        status: 'Pending',
        user_id: Number(user.id),
      };

      // create order for that user
      order = await orderStore.create(order);
    });

    afterEach(async () => {
      await orderStore.delete(Number(order.id), Number(order.user_id));
      await userModel.delete(Number(user.id));
    });

    it('should return all products that have been included in orders', async () => {
      // add product to that order
      addedProductInCart = (await orderStore.addProductToCart(
        Number(order.id),
        Number(product_ids[1]),
        1
      )) as Order_Product;

      const result = await dashboard.productsInOrders();

      expect(result).toBeInstanceOf(Object);
      expect(Object.keys(result).length).toBe(1);

      await orderStore.removeProductFromCart(
        Number(order.id),
        Number(product_ids[1])
      );
    });

    it('should return all users with orders', async () => {
      // add product to that order
      addedProductInCart = (await orderStore.addProductToCart(
        Number(order.id),
        Number(product_ids[1]),
        1
      )) as Order_Product;

      const result = await dashboard.usersWithOrders();

      expect(result).toBeInstanceOf(Object);
      expect(Object.keys(result).length).toBe(1);

      await orderStore.removeProductFromCart(
        Number(order.id),
        Number(product_ids[1])
      );
    });

    it('should return the five most expensive products', async () => {
      const result = await dashboard.fiveMostExpensiveProducts();

      expect(result).toBeInstanceOf(Object);
      expect(Object.keys(result).length).toBe(5);
    });

    it('should index products of specific category', async () => {
      const result = (await dashboard.indexProductsByCategory(
        'product1 category'
      )) as Object;

      expect(result).toBeInstanceOf(Object);
      expect(Object.keys(result).length).toBe(1);
    });
  });
});
