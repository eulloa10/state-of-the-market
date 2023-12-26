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

dotenv.config();

export const indicatorRouter = express.Router();

const indicators: Indicators = indicatorReference;

type IndicatorData = {
  [key: string]: {
    date: string;
    value: number | string;
  };
};

// Latest data for all indicators
indicatorRouter.get('/all/latest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorNames = Object.keys(indicatorReference);
    const indicatorData: IndicatorData = {};

    for (const indicator of indicatorNames) {
      const latestData: CalculatedIndicatorData = await fetchLatestIndicatorData(indicator);
      indicatorData[indicator] = latestData;
    }
    res.json(indicatorData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching the latest indicator data for all indicators' });
  }
});

// Prior period data for all indicators
indicatorRouter.get('/all/prior', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorNames = Object.keys(indicatorReference);
    const indicatorData: IndicatorData = {};

    for (const indicator of indicatorNames) {
      const latestData: CalculatedIndicatorData = await fetchPriorIndicatorData(indicator);
      indicatorData[indicator] = latestData;
    }
    res.json(indicatorData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching prior period indicator data for all indicators' });
  }
});

// All data for a given indicator
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

// Latest data point for an indicator
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

// Prior period data point for an indicator
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

// Data for a given indicator for a given MMYYYY
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

// Latest data point for all indicators
indicatorRouter.get('/all/latest', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const indicatorNames = Object.keys(indicatorReference);
    const indicatorData: IndicatorData = {};

    for (const indicator of indicatorNames) {
      const latestData: CalculatedIndicatorData = await fetchLatestIndicatorData(indicator);
      indicatorData[indicator] = latestData;
    }
    res.json(indicatorData)
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'An error occurred while fetching the latest indicator data for all indicators' });
  }
});

// GET all recent or prior data for all indicators
// indicatorRouter.get('/:period', async (req: Request, res: Response, next: NextFunction) => {
//   const indicatorNames = Object.keys(indicatorReference);
//   const indicatorData: IndicatorData = {};

//   for (const indicatorName of indicatorNames) {
//     let periodYear;
//     let periodMonth;

//     if (req.params.period === 'recent') {
//       [periodYear, periodMonth] = await getIndicatorDate(indicatorName, 'recent');
//     } else if (req.params.period === 'prior') {
//       [periodYear, periodMonth] = await getIndicatorDate(indicatorName, 'prior');
//     } else {
//       return res.status(400).json({ error: 'Invalid period' });
//     }

//     const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);

//     try {
//       const indicatorDataResponse = await axios.get(FRED_API_URL, {
//         params: {
//           observation_end: `${periodYear}-${periodMonth}-${periodLastDay}`,
//           observation_start: `${periodYear}-${periodMonth}-01`,
//           series_id: indicators[indicatorName].seriesId,
//           file_type: FILE_TYPE,
//           sort_order: SORT_ORDER,
//           api_key: process.env.FRED_API_KEY
//         }
//       });

//       const dailyAverage = calcAvgIndicatorValue(indicatorDataResponse.data.observations);

//       const reference = await db.Indicator_Reference.findOne({
//         where: { series_id: indicators[indicatorName].seriesId },
//       });

//       const indicatorRecordExists = await db.Indicator.findOne({
//         where: {
//           indicator_value: dailyAverage,
//           indicator_date: `${periodYear}-${periodMonth}-01`
//          },
//       });

//       if (!indicatorRecordExists) {
//         await db.Indicator.create({
//           indicator_reference_id: reference.id,
//           indicator_value: dailyAverage,
//           indicator_date: `${periodYear}-${periodMonth}-01`,
//         });
//       }

//       indicatorData[indicatorName] = {
//         date: `${periodYear}-${periodMonth}-01`,
//         value: dailyAverage
//       };
//     } catch (e) {
//       console.error(e);
//       return res.status(500).json({ error: 'An error occurred while fetching indicator data' });
//     }
//   }
//   res.json(indicatorData);
// });
