import express, {
  Request,
  Response
} from 'express';
import { apiRoutes } from './api';
import morgan from 'morgan';

export const routes = express.Router();

routes.use('/api', apiRoutes);
routes.use(morgan('dev'))
routes.use((req: Request, res: Response) => {
  res.status(404).json({
    error: '404',
    message: `The requested URL ${req.path} was not found on this server`
  });
});
