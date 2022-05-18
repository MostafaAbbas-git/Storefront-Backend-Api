import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { User, UserModel } from '../models/user';
import {
  authMiddleware,
  validateUserInputsMiddleware,
  adminMiddleware,
} from '../middleware/users.middleware';

dotenv.config();

const userRoutes = (app: express.Application) => {
  app.get('/users/index', [authMiddleware, adminMiddleware], index);
  app.get('/users/show/:userId', [authMiddleware, adminMiddleware], show);
  app.get('/users/myProfile', authMiddleware, showMyProfileData);

  app.post('/users/authenticate', validateUserInputsMiddleware, authenticate);
  app.post('/users', create);

  app.patch('/users/myProfile', authMiddleware, update);
  app.patch(
    '/users/role',
    [authMiddleware, adminMiddleware],
    patchUserRoleByEmail
  );
  app.delete('/users/delete', [authMiddleware, adminMiddleware], destroy);
};

const userModel = new UserModel();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response): Promise<void | unknown> => {
  try {
    const users = await userModel.index();
    res.json(users);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const show = async (_req: Request, res: Response): Promise<void | unknown> => {
  try {
    const user = await userModel.showUserById(Number(_req.params.userId));
    res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const showMyProfileData = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const user = await userModel.showUserById(Number(_req.user.id));
    res.json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const create = async (
  _req: Request,
  res: Response
): Promise<unknown | void> => {
  const user: User = {
    email: _req.body.email,
    first_name: _req.body.first_name,
    last_name: _req.body.last_name,
    password: _req.body.password,
    user_role: _req.body.user_role,
  };
  try {
    const result = await userModel.create(user);
    if (typeof result != 'object') {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const destroy = async (
  _req: Request,
  res: Response
): Promise<void | unknown> => {
  try {
    const userId: number = Number(_req.body.userId);
    const deletedUser = await userModel.delete(userId);

    res.json(deletedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const authenticate = async (
  _req: Request,
  res: Response
): Promise<void | string | unknown> => {
  const user: User = {
    email: _req.body.email,
    password: _req.body.password,
  };
  try {
    const result: User | string = await userModel.authenticate(
      user.email,
      user.password
    );

    if (typeof result !== 'string') {
      var token = jwt.sign(
        {
          id: Number(result.id),
          email: result.email,
          first_name: result.first_name,
          last_name: result.last_name,
          user_role: result.user_role,
        },
        tokenSecret
      );
      _req.headers['Authorization'] = `Bearer ${token}`;

      res.status(200).send(token);
    } else {
      res
        .status(400)
        .json({ msg: `email or password is incorrect. Error: ${result}` });
    }
  } catch (err) {
    return res.status(401).json({ Error: err });
  }
};
const update = async (_req: Request, res: Response): Promise<unknown> => {
  // check if new email already registered to another user
  const userCheck = await userModel.showUserByEmail(_req.body.email);

  if (typeof userCheck !== 'undefined') {
    if (userCheck.email != _req.user.email) {
      return res
        .status(400)
        .json('New email already registered to another user');
    }
  }

  const user: User = {
    id: Number(_req.user.id),
    first_name: _req.body.first_name,
    last_name: _req.body.last_name,
    email: _req.body.email,
    password: _req.body.password,
  };

  try {
    const updatedUser = await userModel.update(user);
    res.json({
      msg: 'Your data has been updated successfully. Please relogin to make sure that your new data is shown correctly.',
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

const patchUserRoleByEmail = async (
  _req: Request,
  res: Response
): Promise<unknown> => {
  const email: string = _req.body.email;
  const newUserRole: number = _req.body.user_role;

  try {
    const updatedUser = await userModel.patchUserRoleByEmail(
      email,
      newUserRole
    );
    res.json({
      msg: 'User role updated successfully.',
      updatedUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};

export default userRoutes;
