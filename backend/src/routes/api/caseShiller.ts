import express, { Request, Response } from 'express';

export const caseShillerRoute = express.Router();

caseShillerRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Case-Shiller": "test response"
  })
});
