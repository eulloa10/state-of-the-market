import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as indicatorReference from '../../data/indicatorReference.json';
import { Indicators } from '../types/interfaces';


dotenv.config();

export const indicatorRoute = express.Router();

const indicators: Indicators = indicatorReference;

indicatorRoute.get('/', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
  const isDailyIndicator = indicators[indicatorName].frequency == 'daily'
  console.log("ISDAILYINDICATOR", isDailyIndicator)

  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })
    res.json({
      [indicatorName]: indicatorData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});

indicatorRoute.get('/recent', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]

  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })
    res.json({
      [indicatorName]: indicatorData.data.observations[0]
    });
  } catch (e) {
    console.error(e);
  }
});

indicatorRoute.get('/prior', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]

  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })

    res.json({
      [indicatorName]: indicatorData.data.observations[1]
    });
  } catch (e) {
    console.error(e);
  }
});


indicatorRoute.get('/:period', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]

  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        observation_end: req.params.period,
        observation_start: req.params.period,
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })
    res.json({
      [indicatorName]: indicatorData.data.observations
    });
  } catch (e) {
    console.error(e);
  }
});

// function calcPeriod (date: string) {
//   console.log("DATESTRING", date)
//   const currentDate = new Date(String(date));
//   console.log("DATE INPUT", currentDate)
//   currentDate.setDate(currentDate.getDate() - 31);
//   console.log("DATE 30 back", currentDate);
//   const newDate = currentDate.toISOString().slice(0,10);
//   console.log("NEW DATE", newDate)
//   return newDate;
// }

// yieldCurveRoute.get('/:period', async (req: Request, res: Response) => {
//   console.log("REQPARAMS", req.params.period)
//   console.log("TYPE", typeof req.params.period)
//   const baseURL = req.baseUrl.split('/');
//   const indicatorName = baseURL[baseURL.length - 1]

//   try {
//     const yieldCurveData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
//       params: {
//         observation_end: req.params.period,
//         observation_start: calcPeriod(String(req.params.period)),
//         series_id: indicators[indicatorName],
//         file_type: 'json',
//         sort_order: 'desc',
//         api_key: process.env.FRED_API_KEY
//       }
//     })
//     res.json({
//       "Yield Curve": yieldCurveData.data.observations
//     });
//   } catch (e) {
//     console.error(e);
//   }
// });
