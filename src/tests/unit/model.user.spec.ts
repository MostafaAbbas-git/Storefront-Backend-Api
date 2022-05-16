import { UserModel } from '../../models/user';

const userModel = new UserModel();

describe('/models/user unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for index method', () => {
      expect(userModel.index).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(userModel.show).toBeDefined();
    });

    it('should be defined for create method', () => {
      expect(userModel.create).toBeDefined();
    });

    it('should be defined for update method', () => {
      expect(userModel.update).toBeDefined();
    });

    it('should be defined for delete method', () => {
      expect(userModel.delete).toBeDefined();
    });

    it('should be defined for authenticate method', () => {
      expect(userModel.authenticate).toBeDefined();
    });

    it('should be defined for patchUserRoleByEmail method', () => {
      expect(userModel.patchUserRoleByEmail).toBeDefined();
    });

    it('should be defined for checkUserByEmail method', () => {
      expect(userModel.checkUserByEmail).toBeDefined();
    });
  });
});
