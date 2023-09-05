import express, {
  Request,
  Response,
  NextFunction
} from 'express';
import indicatorReference from '../../data/indicatorReference.json';

export default function validateIndicator(req: Request, res: Response, next: NextFunction) {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
  if (indicatorName in indicatorReference) {
    next();
  } else {
    res.status(404).json({
      error: 'Parameter not found',
      message: 'The provided parameter is invalid or not found.'
    });
  }
}
