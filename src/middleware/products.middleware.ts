import { Request, Response, NextFunction } from 'express';

export async function validateProductInputsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  if (req.body && req.body.name && req.body.price) {
    next();
  } else {
    return res.status(400).send({
      error: 'Missing required fields name and price',
    });
  }
}
