import { OrderStore } from '../../models/order';

const store = new OrderStore();

describe('/models/order unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for indexAllOrders method', () => {
      expect(store.indexAllOrders).toBeDefined();
    });

    it('should be defined for indexMyOrders method', () => {
      expect(store.indexMyOrders).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(store.show).toBeDefined();
    });

    it('should be defined for getOrderByUserId method', () => {
      expect(store.getOrderByUserId).toBeDefined();
    });

    it('should be defined for create method', () => {
      expect(store.create).toBeDefined();
    });

    it('should be defined for addProductToCart method', () => {
      expect(store.addProductToCart).toBeDefined();
    });

    it('should be defined for removeProductFromCart method', () => {
      expect(store.removeProductFromCart).toBeDefined();
    });

    it('should be defined for updateOrderStatus method', () => {
      expect(store.updateOrderStatus).toBeDefined();
    });

    it('should be defined for indexMyCart method', () => {
      expect(store.indexMyCart).toBeDefined();
    });

    it('should be defined for indexAllCarts method', () => {
      expect(store.indexAllCarts).toBeDefined();
    });

    it('should be defined for delete method', () => {
      expect(store.delete).toBeDefined();
    });
  });
});
