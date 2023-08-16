import { Router, Request, Response } from 'express';

export const UnemploymentRateRoute = Router();

UnemploymentRateRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Unemployment Rate": "test response"
  })
});
