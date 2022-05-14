import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';

const store = new UserStore();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (_req: Request, res: Response) => {
  const user = await store.show(_req.body.id);
  res.json(user);
};

const create = async (_req: Request, res: Response) => {
  const user: User = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const newUser = await store.create(user);
    res.json(newUser);
  } catch (err) {
    res.status(400).send(err);
    console.error(err);
  }
};

const destroy = async (_req: Request, res: Response) => {
  const deleted = await store.delete(_req.body.id);
  res.json(deleted);
};

const authenticate = async (_req: Request, res: Response) => {
  const user: User = {
    username: _req.body.username,
    password: _req.body.password,
  };
  try {
    const u = await store.authenticate(user.username, user.password);
    var token = jwt.sign(
      { user: user.username },
      String(process.env.TOKEN_SECRET)
    );
    res.send(token);
  } catch (err) {
    res.status(401);
    res.json({ msg: err, user });
  }
};
const update = async (req: Request, res: Response) => {
  const user: User = {
    id: Number(req.params.id),
    username: req.body.username,
    password: req.body.password,
  };
  try {
    const authorizationHeader = String(req.headers.authorization);
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, tokenSecret);
    console.log('decoded: ');
    console.log(decoded);

    // if (decoded.id !== user.id) {
    //   throw new Error('User id does not match!');
    // }
  } catch (err) {
    res.status(401);
    res.json(err);
    return;
  }

  try {
    const updated = await store.create(user);
    res.json(updated);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/{:id}', show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.patch('/users/:id', update);
  app.delete('/users', destroy);
};

export default userRoutes;
