import express from 'express';
import { indicatorRouter } from './indicator';
import { reportRouter } from './report';
import morgan from 'morgan';
import validateIndicator from '../middleware/indicatorValidation';

export const apiRoutes = express.Router();
apiRoutes.use(morgan('dev'));

apiRoutes.use('/indicator/:indicatorRouter', validateIndicator, indicatorRouter);
apiRoutes.use('/indicators', indicatorRouter);
apiRoutes.use('/reports', reportRouter);
