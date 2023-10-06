import express from 'express';
import { indicatorRoute } from './indicator';
import morgan from 'morgan';
import validateIndicator from '../middleware/indicatorValidation';

export const apiRoutes = express.Router();
apiRoutes.use(morgan('dev'));

apiRoutes.use('/indicator/:indicatorRoute', validateIndicator, indicatorRoute);
