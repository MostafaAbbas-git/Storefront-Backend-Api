import { Request, Response, NextFunction } from 'express';

export async function validateOrderInputsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<unknown> {
  if (req.body && req.body.user_id) {
    next();
  } else {
    return res.status(400).send({
      error: 'Missing required fields: user_id',
    });
  }
}
