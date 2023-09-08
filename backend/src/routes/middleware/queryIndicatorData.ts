import {
  Request,
  Response,
  NextFunction
} from 'express';
import db from '../../db/models';
import { Indicators } from '../../types/interfaces';
import * as indicatorReference from '../../data/indicatorReference.json';

const indicators: Indicators = indicatorReference;

export default async function queryIndicatorData(req: Request, res:Response, next:NextFunction) {
  const baseURL = req.baseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1]

  try {
    const indicatorId = await db.Indicator_Reference.findOne({
      where: {
        series_id: indicators[indicatorName].seriesId
      }
    })
    // const indicatorData = await db.Indicator.findAll({
    //   where: {
    //     indicator_reference_id: indicatorId[0].dataValues.id
    //   }
    // })
    // req.indicatorQueryData = indicatorData;
    console.log(indicatorId)
    next();
  } catch (e) {
    console.error(e)
  }
}
