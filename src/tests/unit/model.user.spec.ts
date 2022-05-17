import { UserModel, User } from '../../models/user';

const userModel = new UserModel();

describe('/models/user unit test suite', () => {
  describe('Check the definition of all CRUD methods', () => {
    it('should be defined for index method', () => {
      expect(userModel.index).toBeDefined();
    });

    it('should be defined for show method', () => {
      expect(userModel.showUserById).toBeDefined();
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
      expect(userModel.showUserByEmail).toBeDefined();
    });
  });

  describe('Check returns of all methods associated with user model', () => {
    var adminUser: User;
    var basicUser: User;

    beforeEach(async () => {
      basicUser = {
        first_name: 'basicuser first name',
        last_name: 'user last name',
        email: 'useremail@gmail.com',
        password: 'password123',
        user_role: 0,
      };

      adminUser = {
        first_name: 'admin first name',
        last_name: 'admin last name',
        email: 'adminemail@gmail.com',
        password: 'password123',
        user_role: 1,
      };

      basicUser = (await userModel.create(basicUser)) as User;
      adminUser = (await userModel.create(adminUser)) as User;
    });

    afterEach(async () => {
      await userModel.delete(Number(basicUser.id));
      await userModel.delete(Number(adminUser.id));
    });

    it('should create new user and return it', async () => {
      const newUser: User = {
        first_name: 'newuser first name',
        last_name: 'user last name',
        email: 'useremail2@gmail.com',
        password: 'password123',
        user_role: 0,
      };
      const createdUser: User = (await userModel.create(newUser)) as User;
      const deletedUser: User = (await userModel.delete(
        Number(createdUser.id)
      )) as User;

      expect(createdUser.email).toBe('useremail2@gmail.com');
      expect(deletedUser.email).toBe('useremail2@gmail.com');
    });

    it('should index all users', async () => {
      const users = await userModel.index();
      expect(users).toBeInstanceOf(Object);
      expect(Object.keys(users).length).not.toBe(0);
    });

    it('should show one user by their id', async () => {
      const user = await userModel.showUserById(basicUser.id as number);

      expect(user.email).toBe('useremail@gmail.com');
    });

    it('should show one user by their email', async () => {
      const user = await userModel.showUserByEmail(basicUser.email);
      expect(user.email).toBe('useremail@gmail.com');
    });

    it('should update the whole user object and return the updated', async () => {
      basicUser.first_name = 'updated first name';
      const updatedBasicUser: User = await userModel.update(basicUser);

      expect(updatedBasicUser.first_name).toBe('updated first name');
      expect(updatedBasicUser.email).toBe('useremail@gmail.com');
    });

    it('should change user role and return the updated user', async () => {
      const newUserRole: number = 1;

      const updatedBasicUser: User = await userModel.patchUserRoleByEmail(
        basicUser.email,
        newUserRole
      );

      expect(updatedBasicUser.user_role).toBe(1);
      expect(updatedBasicUser.email).toBe('useremail@gmail.com');
    });

    it('should delete one user by its id and return the deleted user object', async () => {
      const deletedUser: User = (await userModel.delete(
        basicUser.id as number
      )) as User;

      expect(deletedUser.email).toBe('useremail@gmail.com');
    });

    it('should authenticate user email and password and return user object', async () => {
      const returnedUser: User = (await userModel.authenticate(
        basicUser.email,
        'password123'
      )) as User;

      expect(returnedUser.email).toBe('useremail@gmail.com');
    });
  });
});
