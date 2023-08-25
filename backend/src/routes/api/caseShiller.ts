import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const caseShillerRoute = express.Router();

caseShillerRoute.get('/', async (req: Request, res: Response) => {
  try {
    const ycData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=CSUSHPINSA&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Case-Shiller Index": ycData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
