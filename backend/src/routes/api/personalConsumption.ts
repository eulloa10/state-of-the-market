import { Router, Request, Response } from 'express';

export const personalConsumptionRoute = Router();

personalConsumptionRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Personal Consumption": "test response"
  })
});
