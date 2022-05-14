import express, { Request, Response } from 'express';
import { Book, BookStore } from '../models/book';
import jwt from 'jsonwebtoken';

const store = new BookStore();
const tokenSecret = String(process.env.TOKEN_SECRET);

const index = async (_req: Request, res: Response) => {
  const books = await store.index();
  res.json(books);
};

const show = async (_req: Request, res: Response) => {
  const book = await store.show(_req.body.id);
  res.json(book);
};

const create = async (_req: Request, res: Response) => {
  try {
    const authorizationHeader = String(_req.headers.authorization);
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, tokenSecret);
  } catch (err) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }

  try {
    const book: Book = {
      title: _req.body.title,
      author: _req.body.author,
      total_pages: _req.body.total_pages,
      summary: _req.body.summary,
    };

    const newBook = await store.create(book);
    res.json(newBook);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = String(req.headers.authorization);
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, tokenSecret);
  } catch (err) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }

  try {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
  } catch (error) {
    res.status(400);
    res.json({ error });
  }
};

const articleRoutes = (app: express.Application) => {
  app.get('/books', index);
  app.get('/books/:id', show);
  app.post('/books', create);
  app.delete('/books', destroy);
};

export default articleRoutes;
