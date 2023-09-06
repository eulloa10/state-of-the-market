import express, {
  Request,
  Response
} from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as indicatorReference from '../../data/indicatorReference.json';
import {
  Indicators
} from '../types/interfaces';
import {
  FREDDataPoint
} from '../types/interfaces';
import {
  getLastDayOfMonth
} from '../../utils/dateCalculators';
import {
  getMostRecentIndicatorDate
} from '../../utils/dateCalculators';
import validateIndicator from '../middleware/indicatorValidation';
import db from '../../config/database.js';


dotenv.config();

db.connect()
  .then((obj) => {
    // You are connected to the database
    // You can now perform database operations using `obj` if needed

    // For example, run a query
    // return obj.query('SELECT * FROM your_table');
    console.log("OBJ: ", obj)
    console.log("CONNECTED")
  })

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
    throw e;
  }
});


indicatorRoute.get('/recent', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1];
  const [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "recent");
  const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);

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

    let invalidValues = 0;

    const dailyConsolidation = indicatorData.data.observations.reduce((acc: number, obj: FREDDataPoint) => {
      if (String(obj.value) === ".") {
        invalidValues++;
        return acc;
      }
      return acc + Number(obj.value)
    }, 0)
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
    throw e;
  }
});


indicatorRoute.get('/prior', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
  const [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "prior");
  console.log("YEAR", periodYear, "MONTH", periodMonth)
  const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);

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

    let invalidValues = 0;

    const dailyConsolidation = indicatorData.data.observations.reduce((acc: number, obj: FREDDataPoint) => {
      if (String(obj.value) === ".") {
        invalidValues++;
        return acc;
      }
      return acc + Number(obj.value)
    }, 0)

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
    throw e;
  }
});

indicatorRoute.get('/:period', async (req: Request, res: Response) => {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
  const [periodYear, periodMonth] = req.params.period.split('-')
  const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);

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

    let invalidValues = 0;
    const dailyConsolidation = indicatorData.data.observations.reduce((acc: number, obj: FREDDataPoint) => {
      if (String(obj.value) === ".") {
        invalidValues++;
        return acc;
      }
      return acc + Number(obj.value)
    }, 0)
    let dailyAverage = (dailyConsolidation / (indicatorData.data.observations.length - invalidValues)).toFixed(2)

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
    throw e;
  }
});
