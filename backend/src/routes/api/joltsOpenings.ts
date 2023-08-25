import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const joltsOpeningsRoute = express.Router();

joltsOpeningsRoute.get('/', async (req: Request, res: Response) => {
  const joltsOpeningsData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=JTSJOL&file_type=json&api_key=${process.env.FRED_API_KEY}`)
  res.json({
    "JOLTS Openings": joltsOpeningsData.data.observations
  });
});
