import express from 'express';
import { apiRoutes } from './api';
import morgan from 'morgan';

export const routes = express.Router();

routes.use('/api', apiRoutes);
routes.use(morgan('dev'))
