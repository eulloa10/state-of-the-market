import {
  Request,
  Response,
  NextFunction
} from 'express';
import db from '../../db/models';
import { Indicators } from '../../types/interfaces';
import * as indicatorReference from '../../data/indicatorReference.json';
import getMostRecentIndicatorDate from '../../utils/getIndicatorDate';

const indicators: Indicators = indicatorReference;

export default async function queryPriorIndicatorData(req: Request, res:Response, next:NextFunction) {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]
  const [periodYear, periodMonth] = await getMostRecentIndicatorDate(indicatorName, "prior");

  try {
    const indicatorId = await db.Indicator_Reference.findOne({
      where: {
        series_id: indicators[indicatorName].seriesId
      }
    })
    const indicatorData = await db.Indicator.findOne({
      where: {
        indicator_reference_id: indicatorId.dataValues.id,
        indicator_date: `${periodYear}-${periodMonth}-01`
      }
    })
    req.indicatorQueryData = indicatorData;
    next();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
