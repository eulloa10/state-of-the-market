import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import * as dotenv from 'dotenv';
import indicatorReference from '../../data/indicatorReference.json';
import {
  CalculatedIndicatorData,
  Indicators
} from '../../types/interfaces';
import db from '../../db/models';
import calcAvgIndicatorValue from '../../utils/calcAvgIndicatorValue';
import fetchIndicatorData from '../../utils/fetchIndicatorData';
import validateIndicatorParam from '../middleware/validateIndicatorParam';
import validatePeriodParam from '../middleware/validatePeriodParam';
import extractPeriodInfo from '../../utils/extractPeriodInfo';
import fetchLatestIndicatorData from '../../utils/fetchLatestIndicatorData';
import fetchPriorIndicatorData from '../../utils/fetchPriorIndicatorData';
import { IndicatorData } from '../../types/interfaces';

dotenv.config();

export const indicatorRouter = express.Router();

const indicators: Indicators = indicatorReference;

// get latest data for all indicators
indicatorRouter.get('/all/latest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorNames = Object.keys(indicatorReference);
    const indicatorData: IndicatorData = {};

    for (const indicator of indicatorNames) {
      const latestData: CalculatedIndicatorData = await fetchLatestIndicatorData(indicator);
      const transaction = await db.sequelize.transaction();

      try {
        console.log("INDICATORNAME", indicators[indicator].seriesId)
        const reference = await db.Indicator_Reference.findOne({
          where: { series_id: indicators[indicator].seriesId },
        });
        await db.Indicator.create({
          indicator_reference_id: reference.id,
          indicator_value: latestData.value,
          indicator_date: latestData.date,
          indicator_period: 'latest'
        });
        await transaction.commit();
      } catch (e) {
        console.error('Transaction failed:', e);
        await transaction.rollback();
      }
      indicatorData[indicator] = latestData;
    }
    res.json(indicatorData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching the latest indicator data for all indicators' });
  }
});

// Get prior period data for all indicators
indicatorRouter.get('/all/prior', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorNames = Object.keys(indicatorReference);
    const indicatorData: IndicatorData = {};

    for (const indicator of indicatorNames) {
      const priorPeriodData: CalculatedIndicatorData = await fetchPriorIndicatorData(indicator);
      const transaction = await db.sequelize.transaction();

      try {
        const reference = await db.Indicator_Reference.findOne({
          where: { series_id: indicators[indicator].seriesId },
        });
        await db.Indicator.create({
          indicator_reference_id: reference.id,
          indicator_value: priorPeriodData.value,
          indicator_date: priorPeriodData.date,
          indicator_period: 'prior'
        });
        await transaction.commit();
      } catch (e) {
        console.error('Transaction failed:', e);
        await transaction.rollback();
      }
      indicatorData[indicator] = priorPeriodData;
    }
    res.json(indicatorData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching prior period indicator data for all indicators' });
  }
});

// Get all data for a given indicator
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

// Get latest data point for an indicator
indicatorRouter.get('/:indicator/latest', validateIndicatorParam, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { indicator } = req.params;
    const latestData: CalculatedIndicatorData = await fetchLatestIndicatorData(indicator);
    res.json(latestData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching latest indicator data' });
  }
});

// Get prior period data point for an indicator
indicatorRouter.get('/:indicator/prior', validateIndicatorParam, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { indicator } = req.params;
    const priorPeriodData: CalculatedIndicatorData = await fetchPriorIndicatorData(indicator);
    res.json(priorPeriodData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching prior period indicator data' });
  }
});

// Get data for a given indicator for a given MMYYYY
indicatorRouter.get('/:indicator/:period', validateIndicatorParam, validatePeriodParam, async (req: Request, res: Response) => {
  try {
    const { indicator, period } = req.params;
    const { periodYear, periodMonth, observation_start, observation_end } = extractPeriodInfo(period);

    const indicatorData = await fetchIndicatorData(indicator, observation_start, observation_end);
    const dailyAverage = calcAvgIndicatorValue(indicatorData);

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
