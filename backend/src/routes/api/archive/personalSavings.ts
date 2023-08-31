import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const personalSavingsRoute = express.Router();

personalSavingsRoute.get('/', async (req: Request, res: Response) => {
  try {
    const personalSavingsData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=PSAVERT&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Personal Savings": personalSavingsData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
