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

export const reportRoute = express.Router();

reportRoute.post('/', async (req: Request, res: Response) => {
  const indicatorNames = Object.keys(indicatorReference);
  const indicatorData = {};

  res.json({
    "testing": "testing"
  })
});
