import express, { Request, Response } from 'express';

export const UnemploymentRateRoute = express.Router();

UnemploymentRateRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Unemployment Rate": "test response"
  })
});
