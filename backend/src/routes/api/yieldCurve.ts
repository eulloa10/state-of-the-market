import { Router, Request, Response } from 'express';

export const yieldCurveRoute = Router();

yieldCurveRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "test": "test response"
  })
});
