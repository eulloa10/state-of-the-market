import express, {
  Request,
  Response,
  NextFunction
} from 'express';
import indicatorReference from '../../data/indicatorReference.json';

export default function validateIndicatorParam(req: Request, res: Response, next: NextFunction) {
  const { indicator } = req.params;
  if (indicator in indicatorReference) {
    next();
  } else {
    res.status(404).json({
      error: 'Parameter not found',
      message: `The provided parameter '${indicator}' is invalid or not found.`
    });
  }
}
