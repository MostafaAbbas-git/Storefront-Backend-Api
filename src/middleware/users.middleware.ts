import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const tokenSecret = String(process.env.TOKEN_SECRET);
interface UserMiddlewareInterface extends Object {
  id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
  user_role?: number;
}

declare global {
  namespace Express {
    interface Request {
      user: UserMiddlewareInterface;
    }
  }
}

export async function validateUserInputsMiddleware(
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
    const decoded = jwt.verify(token, tokenSecret);
    const myObject: UserMiddlewareInterface = decoded;
    req.user = myObject;
    next();
  } catch (error) {
    res.status(400).send({
      error: 'Invalid token.',
    });
  }
}

export async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  const user_role = Number(req.user.user_role);

  try {
    // user_role == 1 means ADMIN
    if (user_role == 1) {
      next();
    } else {
      return res.status(401).send({ Error: 'Access denied. Unauthorized.' });
    }
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
}
