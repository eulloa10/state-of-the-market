import express, { Request, Response } from 'express';

export const personalConsumptionRoute = express.Router();

personalConsumptionRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Personal Consumption": "test response"
  })
});
