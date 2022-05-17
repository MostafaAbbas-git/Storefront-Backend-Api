import { OrderStore, Order, Order_Product, Cart } from '../../models/order';
import { ProductStore, Product } from '../../models/product';
import { UserModel, User } from '../../models/user';

const orderStore = new OrderStore();
const productStore = new ProductStore();
const userModel = new UserModel();

describe('/models/order unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for indexAllOrders method', () => {
      expect(orderStore.indexAllOrders).toBeDefined();
    });

    it('should be defined for indexMyOrders method', () => {
      expect(orderStore.indexMyOrders).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(orderStore.show).toBeDefined();
    });

    it('should be defined for getOrderByUserId method', () => {
      expect(orderStore.getOrderByUserId).toBeDefined();
    });

    it('should be defined for create method', () => {
      expect(orderStore.create).toBeDefined();
    });

    it('should be defined for addProductToCart method', () => {
      expect(orderStore.addProductToCart).toBeDefined();
    });

    it('should be defined for removeProductFromCart method', () => {
      expect(orderStore.removeProductFromCart).toBeDefined();
    });

    it('should be defined for updateOrderStatus method', () => {
      expect(orderStore.updateOrderStatus).toBeDefined();
    });

    it('should be defined for indexMyCart method', () => {
      expect(orderStore.indexMyCart).toBeDefined();
    });

    it('should be defined for indexAllCarts method', () => {
      expect(orderStore.indexAllCarts).toBeDefined();
    });

    it('should be defined for delete method', () => {
      expect(orderStore.delete).toBeDefined();
    });
  });

  describe('Check returns of all methods associated with order model', () => {
    let user: User;
    let order: Order;
    let user2: User;
    let product: Product;

    beforeEach(async () => {
      user = {
        first_name: 'admin first name',
        last_name: 'admin last name',
        email: 'adminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      user2 = {
        first_name: 'user2 model first name',
        last_name: 'user last name',
        email: 'orderUserEmail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      user = (await userModel.create(user)) as User;

      order = {
        status: 'Pending',
        user_id: Number(user.id),
      };

      order = await orderStore.create(order);

      product = {
        name: 'product name',
        price: 10,
        category: 'product category',
      };

      product = await productStore.create(product);
    });

    afterEach(async () => {
      await productStore.delete(Number(product.id));
      await orderStore.delete(Number(order.id), Number(order.user_id));
      await userModel.delete(Number(user.id));
    });

    it('should create new order with Pending status and return it', async () => {
      // order already created in beforeEach
      expect(order.status).toBe('Pending');
    });

    it('should index all orders', async () => {
      user2 = (await userModel.create(user2)) as User;
      const order2: Order = await orderStore.create({
        status: 'Pending',
        user_id: Number(user2.id),
      });

      const orders: Order[] = await orderStore.indexAllOrders();
      expect(orders).toBeInstanceOf(Object);
      expect(Object.keys(orders).length).toBe(2);
      await orderStore.delete(Number(order2.id), Number(order2.user_id));
    });

    it('should index logged in user orders (my orders)', async () => {
      const myOrders: Order[] = await orderStore.indexMyOrders(Number(user.id));
      expect(myOrders).toBeInstanceOf(Object);
      expect(Object.keys(myOrders).length).not.toBe(0);
    });

    it('should show one order by its id and user id', async () => {
      const myOrder: Order = await orderStore.show(
        Number(order.id),
        Number(user.id)
      );
      expect(myOrder).toBeInstanceOf(Object);
      expect(myOrder.status).toBe('Pending');
    });

    it('should add product to user pending cart and return it', async () => {
      const addResult: Order_Product = (await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      )) as Order_Product;
      expect(addResult).toBeInstanceOf(Object);
      expect(addResult.quantity).toBe(1);

      await orderStore.removeProductFromCart(
        Number(order.id),
        Number(product.id)
      );
    });

    it('should remove product from user pending cart and return it', async () => {
      const addResult: Order_Product = (await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      )) as Order_Product;

      const removeResult: Order_Product =
        (await orderStore.removeProductFromCart(
          Number(addResult.order_id),
          Number(addResult.product_id)
        )) as Order_Product;

      expect(removeResult).toBeInstanceOf(Object);
      expect(removeResult.quantity).toBe(1);
    });

    it('should update order status and return the updated order', async () => {
      const newStatus: string = 'Active';

      const updatedOrder: Order = (await orderStore.updateOrderStatus(
        Number(order.id),
        newStatus
      )) as Order;

      expect(updatedOrder).toBeInstanceOf(Object);
      expect(updatedOrder.status).toBe(newStatus);
    });

    it('should index logged in user cart', async () => {
      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );
      const result: Cart[] = (await orderStore.indexMyCart(
        Number(user.id)
      )) as Cart[];
      expect(result).toBeInstanceOf(Object);
      expect(result[0].quantity).toBe(1);

      await orderStore.removeProductFromCart(
        Number(order.id),
        Number(product.id)
      );
    });

    it('should index all pending carts for admins', async () => {
      const cartStatus: string = 'Pending';

      await orderStore.addProductToCart(
        Number(order.id),
        Number(product.id),
        1
      );
      const result = await orderStore.indexAllCarts(cartStatus);

      expect(result).toBeInstanceOf(Object);
      expect(Object.keys(result).length).not.toBe(0);

      await orderStore.removeProductFromCart(
        Number(order.id),
        Number(product.id)
      );
    });
  });
});
