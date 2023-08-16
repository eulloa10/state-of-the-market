import { Router, Request, Response } from 'express';

export const fedFundsRoute = Router();

fedFundsRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "ffr": "test response"
  })
});
