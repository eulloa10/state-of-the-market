import express from 'express';
import { yieldCurveRoute } from './yieldCurve';

export const apiRoutes = express.Router();

apiRoutes.use('/yieldCurve', yieldCurveRoute)

// routes.get('/api', (req: Request, res: Response): void => {
//   res.send("What's up doc?!")
// });
