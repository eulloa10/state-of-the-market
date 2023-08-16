import express, { Request, Response } from 'express';

export const yieldCurveRoute = express.Router();

yieldCurveRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Yield Curve": "test response"
  })
});
