import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const consumerConfidenceRoute = express.Router();

consumerConfidenceRoute.get('/', async (req: Request, res: Response) => {
  try {
    const consumerConfData = await axios.get(`https://api.stlouisfed.org/fred/series/observations?series_id=CSCICP03USM665S&file_type=json&api_key=${process.env.FRED_API_KEY}`)
    res.json({
      "Consumer Confidence": consumerConfData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
