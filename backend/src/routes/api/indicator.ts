import express, { Request, Response } from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as indicatorReference from '../../data/indicatorReference.json';
import { Indicators } from '../types/interfaces';
import { FREDDataPoint } from '../types/interfaces';
import { getLastDay } from '../../utils/dateCalculators';


dotenv.config();

export const indicatorRoute = express.Router();

const indicators: Indicators = indicatorReference;

indicatorRoute.get('/', async (req: Request, res: Response) => {
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
  const periodMonth = req.params.period.split('-')[1]
  const periodYear = req.params.period.split('-')[0]
  const periodLastDay = getLastDay(periodMonth, periodYear);

  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        observation_end: `${periodYear}-${periodMonth}-${periodLastDay}`,
        observation_start: `${periodYear}-${periodMonth}-01`,
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    })

    const dailyConsolidation = indicatorData.data.observations.reduce((acc: number, obj: FREDDataPoint) => acc + Number(obj.value), 0)
    let dailyAverage = (dailyConsolidation / indicatorData.data.observations.length).toFixed(2)

    if (dailyConsolidation === 0) {
      dailyAverage = "Value not reported"
    }

    res.json({
      [indicatorName]: {
        "date": `${periodYear}-${periodMonth}-01`,
        "value": dailyAverage
      }
    });
  } catch (e) {
    console.error(e);
  }
});
