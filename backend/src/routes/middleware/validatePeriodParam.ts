import express, {
  Request,
  Response,
  NextFunction
} from 'express';
import indicatorReference from '../../data/indicatorReference.json';

export default function validatePeriodParam(req: Request, res: Response, next: NextFunction) {
  const { period } = req.params;
  console.log("PERIOD: ", period)
  const validPeriodFormat = /^(0[1-9]|1[0-2])(20\d{2})$/;
  if (!validPeriodFormat.test(period)) {
    return res.status(400).json({
      error: 'Invalid Period Format',
      message: 'The period should be in the format MMYYYY.',
    });
  }
  next();
}
