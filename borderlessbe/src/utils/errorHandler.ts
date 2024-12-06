import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
