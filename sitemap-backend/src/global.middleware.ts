import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { decode } from 'jsonwebtoken';
export function globalMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.split(' ').pop();
      if (token) {
        req.user = decode(token);
      }
    }
  } catch (err) {
  } finally {
    next();
  }
}
