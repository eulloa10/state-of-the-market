import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const UnemploymentRateRoute = express.Router();

UnemploymentRateRoute.get('/', async (req: Request, res: Response) => {
  try {
    const unemploymentData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Unemployment Rate": unemploymentData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
