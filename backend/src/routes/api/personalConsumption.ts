import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const personalConsumptionRoute = express.Router();

personalConsumptionRoute.get('/', (req: Request, res: Response): void => {
  const personalConsData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=JTSTSR&file_type=json&api_key=${process.env.FRED_API_KEY}`)
  res.json({
    "Personal Consumption": personalConsData.data.observations
  });
});
