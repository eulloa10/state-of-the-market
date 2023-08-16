import express, { Request, Response } from 'express';

export const consumerPriceIndexRoute = express.Router();

consumerPriceIndexRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Consumer Price Index": "test response"
  })
});
