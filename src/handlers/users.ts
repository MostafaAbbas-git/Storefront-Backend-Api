import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';
import {
  authMiddleware,
  validateUserInputsMiddleware,
} from '../middleware/users.middleware';

const userRoutes = (app: express.Application) => {
  app.get('/users', authMiddleware, index);
  app.get('/users/:id', authMiddleware, show);
  app.post('/users', create);
  app.post('/users/authenticate', validateUserInputsMiddleware, authenticate);
  app.patch('/users/:id', update);
  app.delete('/users/:id', destroy);
};

const store = new UserStore();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response): Promise<void> => {
  const users = await store.index();
  //pick only needed items from users list.
  res.json(users);
};

const show = async (_req: Request, res: Response): Promise<void> => {
  const user = await store.show(Number(_req.params.id));
  res.json(user);
};

const create = async (_req: Request, res: Response): Promise<void> => {
  const user: User = {
    email: _req.body.email,
    first_name: _req.body.first_name,
    last_name: _req.body.last_name,
    password: _req.body.password,
  };
  try {
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
};

const destroy = async (_req: Request, res: Response): Promise<void> => {
  const deleted = await store.delete(Number(_req.params.id));
  res.json(deleted);
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
    const result = await store.authenticate(user.email, user.password);

    if (result.email !== '') {
      var token = jwt.sign(
        {
          id: Number(result.id),
          email: result.email,
          first_name: result.first_name,
          last_name: result.last_name,
        },
        tokenSecret
      );
      _req.headers['Authorization'] = `Bearer ${token}`;
      res.send(token);
    } else {
      res.status(400).json({ msg: 'email or password is incorrect' });
    }
  } catch (err) {
    res.status(401);
    res.json({ msg: err, user });
    return;
  }
};
const update = async (_req: Request, res: Response): Promise<void> => {
  // set currentEmail = email fetched from token provided
  const currentEmail = _req.body.email;

  const user: User = {
    id: Number(_req.params.id),
    first_name: _req.body.first_name,
    last_name: _req.body.last_name,
    email: _req.body.new_email,
    password: _req.body.password,
  };

  try {
    const updated = await store.update(user, currentEmail);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json(err);
  }
};

export default userRoutes;
