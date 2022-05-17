import { ProductStore, Product } from '../../models/product';

const productStore = new ProductStore();

describe('/models/product unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for index method', () => {
      expect(productStore.index).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(productStore.show).toBeDefined();
    });

    it('should be defined for create method', () => {
      expect(productStore.create).toBeDefined();
    });

    it('should be defined for delete method', () => {
      expect(productStore.delete).toBeDefined();
    });
  });

  describe('Check returns of all methods associated with product model', () => {
    let product: Product;
    let product2: Product;

    beforeEach(async () => {
      product = {
        name: 'product name',
        price: 10,
        category: 'product category',
      };

      product2 = {
        name: 'product name2',
        price: 20,
        category: 'product category2',
      };

      product = await productStore.create(product);
      product2 = await productStore.create(product);
    });

    afterEach(async () => {
      await productStore.delete(Number(product.id));
      await productStore.delete(Number(product2.id));
    });

    it('should create new product and return it', async () => {
      const createdProduct: Product = await productStore.create({
        name: 'product3 name',
        price: 30,
        category: 'product category3',
      });
      const deletedProduct: Product = (await productStore.delete(
        Number(createdProduct.id)
      )) as Product;
      expect(createdProduct.name).toBe('product3 name');
      expect(deletedProduct.category).toBe('product category3');
      expect(createdProduct).toBeInstanceOf(Object);
    });

    it('should index all products', async () => {
      const products: Product[] = await productStore.index();
      expect(products).toBeInstanceOf(Object);
      expect(Object.keys(products).length).toBe(2);
    });

    it('should show one product by its id', async () => {
      const oneProduct: Product = (await productStore.show(
        Number(product.id)
      )) as Product;
      expect(oneProduct).toBeInstanceOf(Object);
      expect(oneProduct.name).toBe('product name');
    });

    it('should delete a product and return it', async () => {
      const createdProduct: Product = await productStore.create({
        name: 'product3 name',
        price: 30,
        category: 'product category3',
      });
      const deletedProduct: Product = (await productStore.delete(
        Number(createdProduct.id)
      )) as Product;

      expect(deletedProduct.name).toBe('product3 name');
      expect(deletedProduct.category).toBe('product category3');
      expect(deletedProduct).toBeInstanceOf(Object);
    });
  });
});
