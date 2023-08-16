import express, { Router, Request, Response } from 'express';

export const consumerConfidenceRoute = express.Router();

consumerConfidenceRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Consumer Confidence": "test response"
  })
});
