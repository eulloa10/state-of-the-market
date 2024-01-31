import express from 'express';
import { indicatorRouter } from './indicator';
import { reportRouter } from './report';
import { emailServerRouter } from './emailServer';
import morgan from 'morgan';

export const apiRoutes = express.Router();
apiRoutes.use(morgan('dev'));

apiRoutes.use('/indicators', indicatorRouter);
apiRoutes.use('/reports', reportRouter);
apiRoutes.use('/distribution', emailServerRouter);
