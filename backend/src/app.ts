import express, { Application } from 'express';
import morgan from 'morgan';
import { routes } from './routes';
import { Sequelize } from 'sequelize';

const app: Application = express();

const PORT: number = 8080;

app.use('/', routes);
app.use(morgan('dev'));

// app.use('/', (req: Request, res: Response): void => {
//     res.send('Hello world!');
// });

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
