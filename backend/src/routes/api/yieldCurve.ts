import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export const yieldCurveRoute = express.Router();

yieldCurveRoute.get('/', async (req: Request, res: Response) => {
  try {
    const yieldCurveData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: 'DGS10',
        file_type: 'json',
        api_key: process.env.FRED_API_KEY
      }
    })
    res.json({
      "Yield Curve": yieldCurveData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});

function calcDate (date: string) {
  console.log("DATESTRING", date)
  const currentDate = new Date(String(date));
  console.log("DATE INPUT", currentDate)
  currentDate.setDate(currentDate.getDate() - 31);
  console.log("DATE 30 back", currentDate);
  const newDate = currentDate.toISOString().slice(0,10);
  console.log("NEW DATE", newDate)
  return newDate;
}

yieldCurveRoute.get('/:date', async (req: Request, res: Response) => {
  console.log("REQPARAMS", req.params.date)
  console.log("TYPE", typeof req.params.date)

  try {
    const yieldCurveData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        observation_end: req.params.date,
        observation_start: calcDate(String(req.params.date)),
        series_id: 'DGS10',
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })
    res.json({
      "Yield Curve": yieldCurveData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});
