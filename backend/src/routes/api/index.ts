import express from 'express';
import { yieldCurveRoute } from './yieldCurve';
import { fedFundsRoute } from './fedFundsRate';
import { caseShillerRoute } from './caseShiller';
import { consumerConfidenceRoute } from './consumerConfidence';
import { consumerPriceIndexRoute } from './consumerPriceIndex';
import { joltsOpeningsRoute } from './joltsOpenings';
import { joltsHiresRoute } from './joltsHires';
import { joltsTurnoverRoute } from './joltsTurnover';
import { personalConsumptionRoute } from './personalConsumption';
import { personalSavingsRoute } from './personalSavings';
import { UnemploymentRateRoute } from './unemploymentRate';
import morgan from 'morgan';

export const apiRoutes = express.Router();
apiRoutes.use(morgan('dev'));

apiRoutes.use('/yield-curve', yieldCurveRoute);
apiRoutes.use('/fed-funds-rate', fedFundsRoute);
apiRoutes.use('/case-shiller', caseShillerRoute);
apiRoutes.use('/consumer-confidence', consumerConfidenceRoute);
apiRoutes.use('/jolts-openings', joltsOpeningsRoute);
apiRoutes.use('/jolts-hires', joltsHiresRoute);
apiRoutes.use('/jolts-turnovers', joltsTurnoverRoute);
apiRoutes.use('/personal-consumption', personalConsumptionRoute);
apiRoutes.use('/personal-savings', personalSavingsRoute);
apiRoutes.use('/unemployment-rate', UnemploymentRateRoute);
apiRoutes.use('/cpi', consumerPriceIndexRoute);

// routes.get('/api', (req: Request, res: Response): void => {
//   res.send("What's up doc?!")
// });
