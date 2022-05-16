import { ProductStore } from '../../models/product';

const store = new ProductStore();

describe('/models/product unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for index method', () => {
      expect(store.index).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(store.show).toBeDefined();
    });

    it('should be defined for create method', () => {
      expect(store.create).toBeDefined();
    });

    it('should be defined for delete method', () => {
      expect(store.delete).toBeDefined();
    });
  });
});
