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
import {
  FREDDataPoint
} from '../../types/interfaces';
import getLastDayOfMonth
from '../../utils/getLastDayOfMonth';
import
getMostRecentIndicatorDate
from '../../utils/getMostRecentIndicatorDate';
import validateIndicatorParam from '../middleware/indicatorValidation';
import queryRecentIndicatorData from '../middleware/queryRecentIndicatorData';
import queryPriorIndicatorData from '../middleware/queryPriorIndicatorData';
import db from '../../db/models';
import querySelectedIndicatorData from '../middleware/querySelectedIndicatorData';

dotenv.config();

export const indicatorRoute = express.Router();

const indicators: Indicators = indicatorReference;

indicatorRoute.get('/', validateIndicatorParam, async (req: Request, res: Response) => {
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


indicatorRoute.get('/recent', queryRecentIndicatorData, async (req: Request, res: Response) => {
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

    let dailyAverage = (dailyConsolidation / (indicatorData.data.observations.length - invalidValues)).toFixed(2)

    if (dailyConsolidation === 0) {
      dailyAverage = "Value not reported"
    }

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
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
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
