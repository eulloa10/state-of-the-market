import express from 'express';
import { indicatorRoute } from './indicator';
import morgan from 'morgan';

export const apiRoutes = express.Router();
apiRoutes.use(morgan('dev'));

apiRoutes.use('/:indicatorRoute', indicatorRoute);
