import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const personalSavingsRoute = express.Router();

personalSavingsRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Personal Savings": "test response"
  })
});
