import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const consumerPriceIndexRoute = express.Router();

consumerPriceIndexRoute.get('/', async (req: Request, res: Response) => {
  const cpiData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=CPIAUCSL&file_type=json&api_key=${process.env.FRED_API_KEY}`)
  res.json({
    "Consumer Price Index": cpiData.data.observations
  });
});
