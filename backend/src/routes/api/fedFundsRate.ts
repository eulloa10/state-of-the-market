import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const fedFundsRoute = express.Router();

fedFundsRoute.get('/', async (req: Request, res: Response) => {
  try {
    const fedFundsRateData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=EFFR&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Federal Funds Rate": fedFundsRateData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
