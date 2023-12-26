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
import { FRED_API_URL, FILE_TYPE, SORT_ORDER } from '../../constants';
import fetchIndicatorData from '../../utils/fetchIndicatorData';
import validateIndicatorParam from '../middleware/validateIndicatorParam';
import validatePeriodParam from '../middleware/validatePeriodParam';
import extractPeriodInfo from '../../utils/extractPeriodInfo';

dotenv.config();

export const indicatorRouter = express.Router();

const indicators: Indicators = indicatorReference;

type IndicatorData = {
  [key: string]: {
    date: string;
    value: number | string;
  };
};

// GET all data for a given indicator
indicatorRouter.get('/:indicator', validateIndicatorParam, async (req: Request, res: Response) => {
  try {
    const { indicator } = req.params;
    const indicatorData = await fetchIndicatorData(indicator);

    res.json({
      [indicator]: indicatorData,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching indicator data' });
  }
});

// GET data for a given indicator for a given month and year combo
indicatorRouter.get('/:indicator/:period', validateIndicatorParam, validatePeriodParam, async (req: Request, res: Response) => {
  try {
    const { indicator, period } = req.params;
    const { periodYear, periodMonth, observation_start, observation_end } = extractPeriodInfo(period);

    const indicatorData = await fetchIndicatorData(indicator, observation_start, observation_end);

    let dailyAverage = calcAvgIndicatorValue(indicatorData);

    res.json({
      [indicator]: {
        "date": `${periodYear}-${periodMonth}-01`,
        "value": dailyAverage
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

// GET all recent or prior data for all indicators
indicatorRouter.get('/:period', async (req: Request, res: Response, next: NextFunction) => {
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
      const indicatorDataResponse = await axios.get(FRED_API_URL, {
        params: {
          observation_end: `${periodYear}-${periodMonth}-${periodLastDay}`,
          observation_start: `${periodYear}-${periodMonth}-01`,
          series_id: indicators[indicatorName].seriesId,
          file_type: FILE_TYPE,
          sort_order: SORT_ORDER,
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

// GET latest or prior data value for a given indicator
indicatorRouter.get('/:period', async (req: Request, res: Response, next: NextFunction) => {
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
    const indicatorData = await axios.get(FRED_API_URL, {
      params: {
        observation_end: `${periodYear}-${periodMonth}-${periodLastDay}`,
        observation_start: `${periodYear}-${periodMonth}-01`,
        series_id: indicators[indicatorName].seriesId,
        file_type: FILE_TYPE,
        sort_order: SORT_ORDER,
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
