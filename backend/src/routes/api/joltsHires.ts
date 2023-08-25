import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const joltsHiresRoute = express.Router();

joltsHiresRoute.get('/', async (req: Request, res: Response) => {
  try {
    const joltsHireData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=JTSHIR&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "JOLTS Hires": joltsHireData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
