import express, {
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
import queryRecentIndicatorData from '../middleware/queryRecentIndicatorData';
import queryPriorIndicatorData from '../middleware/queryPriorIndicatorData';
import db from '../../db/models';
import querySelectedIndicatorData from '../middleware/querySelectedIndicatorData';
import calcAvgIndicatorValue from '../../utils/calcAvgIndicatorValue';
import parseIndicatorName from '../../utils/parseIndicatorName';

dotenv.config();

export const indicatorRoute = express.Router();

const indicators: Indicators = indicatorReference;

// Get all data for a given indicator
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

// Get most recent data for given indicator
indicatorRoute.get('/recent', async (req: Request, res: Response) => {
  const indicatorName = parseIndicatorName(req.baseUrl);
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

    let dailyAverage = calcAvgIndicatorValue(indicatorData.data.observations);

    if (req.indicatorQueryData) {
      const data = req.indicatorQueryData.dataValues;
      const selectedIndicator = await db.Indicator.findByPk(data.id)
      selectedIndicator.set({
        'indicator_value': dailyAverage
      });
      await selectedIndicator.save();
    } else {
      const indicatorReferenceId = await db.Indicator_Reference.findOne({
        where: {
          series_id: indicators[indicatorName].seriesId
        }
      })
      const newIndicatorData = await db.Indicator.create({
        'indicator_reference_id': indicatorReferenceId.dataValues.id,
        'indicator_value': dailyAverage,
        'indicator_date': `${periodYear}-${periodMonth}-01`
      })
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


indicatorRoute.get('/prior', queryPriorIndicatorData, async (req: Request, res: Response) => {
  const indicatorName = parseIndicatorName(req.baseUrl);
  const [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "prior");
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

    if (req.indicatorQueryData) {
      const data = req.indicatorQueryData.dataValues;
      const selectedIndicator = await db.Indicator.findByPk(data.id)
      selectedIndicator.set({
        'indicator_value': dailyAverage
      });
      await selectedIndicator.save();
    } else {
      const indicatorReferenceId = await db.Indicator_Reference.findOne({
        where: {
          series_id: indicators[indicatorName].seriesId
        }
      })
      const newIndicatorData = await db.Indicator.create({
        'indicator_reference_id': indicatorReferenceId.dataValues.id,
        'indicator_value': dailyAverage,
        'indicator_date': `${periodYear}-${periodMonth}-01`
      })
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

indicatorRoute.get('/:period', querySelectedIndicatorData, async (req: Request, res: Response) => {
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

    if (req.indicatorQueryData) {
      const data = req.indicatorQueryData.dataValues;
      const selectedIndicator = await db.Indicator.findByPk(data.id)
      selectedIndicator.set({
        'indicator_value': dailyAverage
      });
      await selectedIndicator.save();
    } else {
      const indicatorReferenceId = await db.Indicator_Reference.findOne({
        where: {
          series_id: indicators[indicatorName].seriesId
        }
      })
      const newIndicatorData = await db.Indicator.create({
        'indicator_reference_id': indicatorReferenceId.dataValues.id,
        'indicator_value': dailyAverage,
        'indicator_date': `${periodYear}-${periodMonth}-01`
      })
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
