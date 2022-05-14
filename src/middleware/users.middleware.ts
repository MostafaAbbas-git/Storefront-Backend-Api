import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const tokenSecret = String(process.env.TOKEN_SECRET);

export async function validateRequiredUserBodyFields(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  if (req.body && req.body.email && req.body.password) {
    next();
  } else {
    return res.status(400).send({
      error: 'Missing required fields email and password',
    });
  }
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  const authorizationHeader = String(req.headers.authorization);
  const token = authorizationHeader.split(' ')[1];
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    jwt.verify(token, tokenSecret);

    next();
  } catch (error) {
    res.status(400).send({
      error: 'Invalid token.',
    });
  }
}
