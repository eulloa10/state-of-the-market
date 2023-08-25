import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const joltsTurnoverRoute = express.Router();

joltsTurnoverRoute.get('/', async (req: Request, res: Response) => {
  try {
    const joltsTurnoverData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=JTSTSR&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "JOLTS Turnover": joltsTurnoverData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
