import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as indicatorReference from '../../data/indicatorReference.json';
import {
  Indicators
} from '../../types/interfaces';
import getLastDayOfMonth
from '../../utils/getLastDayOfMonth';
import
getMostRecentIndicatorDate
from '../../utils/getMostRecentIndicatorDate';
import db from '../../db/models';
import calcAvgIndicatorValue from '../../utils/calcAvgIndicatorValue';
import parseIndicatorName from '../../utils/parseIndicatorName';

dotenv.config();

export const indicatorRoute = express.Router();

const indicators: Indicators = indicatorReference;

indicatorRoute.get('/', async (req: Request, res: Response) => {
  const indicatorName = parseIndicatorName(req.baseUrl);

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

indicatorRoute.get('/:period', async (req: Request, res: Response, next: NextFunction) => {
  const indicatorName = parseIndicatorName(req.baseUrl);
  let periodYear;
  let periodMonth;

  if (req.params.period === 'recent') {
    [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "recent");
  } else if (req.params.period === 'prior') {
    [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "prior");
  } else {
    next();
    return;
  }

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

    let dailyAverage = calcAvgIndicatorValue(indicatorData.data.observations);

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

indicatorRoute.get('/period/:yearMonth', async (req: Request, res: Response) => {
  const indicatorName = parseIndicatorName(req.baseUrl);
  const [periodYear, periodMonth] = req.params.yearMonth.split('-')
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

    let dailyAverage = calcAvgIndicatorValue(indicatorData.data.observations);

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
