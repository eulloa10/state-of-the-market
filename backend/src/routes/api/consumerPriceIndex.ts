import { Router, Request, Response } from 'express';

export const consumerPriceIndexRoute = Router();

consumerPriceIndexRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Consumer Price Index": "test response"
  })
});
