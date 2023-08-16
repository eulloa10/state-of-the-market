import { Router, Request, Response } from 'express';

export const personalSavingsRoute = Router();

personalSavingsRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Personal Savings": "test response"
  })
});
