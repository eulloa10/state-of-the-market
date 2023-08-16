import express, { Request, Response } from 'express';

export const joltsRoute = express.Router();

joltsRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "jolts": "test response"
  })
});
