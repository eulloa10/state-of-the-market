import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import indicatorReference from '../../data/indicatorReference.json';
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

type IndicatorData = {
  [key: string]: {
    date: string;
    value: number | string;
  };
};

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

indicatorRoute.get('/all/:period', async (req: Request, res: Response, next: NextFunction) => {
  const indicatorNames = Object.keys(indicatorReference);
  const indicatorData: IndicatorData = {};

  for (const indicatorName of indicatorNames) {
    let periodYear;
    let periodMonth;

    if (req.params.period === 'recent') {
      [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, 'recent');
    } else if (req.params.period === 'prior') {
      [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, 'prior');
    } else {
      return res.status(400).json({ error: 'Invalid period' });
    }

    const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);

    try {
      const indicatorDataResponse = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
        params: {
          observation_end: `${periodYear}-${periodMonth}-${periodLastDay}`,
          observation_start: `${periodYear}-${periodMonth}-01`,
          series_id: indicators[indicatorName].seriesId,
          file_type: 'json',
          sort_order: 'desc',
          api_key: process.env.FRED_API_KEY
        }
      });

      const dailyAverage = calcAvgIndicatorValue(indicatorDataResponse.data.observations);

      const reference = await db.Indicator_Reference.findOne({
        where: { series_id: indicators[indicatorName].seriesId },
      });

      const indicatorRecordExists = await db.Indicator.findOne({
        where: {
          indicator_value: dailyAverage,
          indicator_date: `${periodYear}-${periodMonth}-01`
         },
      });

      // console.log("INDICATOREXISTS: ", indicatorRecordExists)

      if (!indicatorRecordExists) {
        await db.Indicator.create({
          indicator_reference_id: reference.id,
          indicator_value: dailyAverage,
          indicator_date: `${periodYear}-${periodMonth}-01`,
        });
      }

      indicatorData[indicatorName] = {
        date: `${periodYear}-${periodMonth}-01`,
        value: dailyAverage
      };
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'An error occurred while fetching indicator data' });
    }
  }
  res.json(indicatorData);
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

indicatorRoute.get('/period/:period', async (req: Request, res: Response) => {
  const indicatorName = parseIndicatorName(req.baseUrl);
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
