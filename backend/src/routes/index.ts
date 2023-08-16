import express from 'express';
import { apiRoutes } from './api';

export const routes = express.Router();

routes.use('/api', apiRoutes)
