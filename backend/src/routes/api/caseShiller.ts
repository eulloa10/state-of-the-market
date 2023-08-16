import { Router, Request, Response } from 'express';

export const caseShillerRoute = Router();

caseShillerRoute.get('/', (req: Request, res: Response): void => {
  res.status(200).json({
    "Case-Shiller": "test response"
  })
});
