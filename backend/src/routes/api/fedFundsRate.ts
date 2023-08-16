import express, { Request, Response } from 'express';

export const fedFundsRoute = express.Router();

fedFundsRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "ffr": "test response"
  })
});
