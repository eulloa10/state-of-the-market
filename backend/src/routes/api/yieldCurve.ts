import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const yieldCurveRoute = express.Router();

yieldCurveRoute.get('/', async (req: Request, res: Response) => {
  try {
    const yieldCurveDate = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=DGS10&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Yield Curve": yieldCurveDate.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
