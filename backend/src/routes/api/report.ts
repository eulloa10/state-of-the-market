import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import * as dotenv from 'dotenv';
import indicatorReference from '../../data/indicatorReference.json';
import {
  Indicators
} from '../../types/interfaces';
import db from '../../db/models';
import { Op } from "sequelize";

dotenv.config();

export const reportRoute = express.Router();

// Add error handling in the event that the recent and prior data
// does not exist yet
reportRoute.post('/', async (req: Request, res: Response) => {
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1;
  const reportDay = now.getDate();

  let newRecords = []

  try {
    const indicators = await db.Indicator.findAll({
      where: {
        createdAt: {
          [Op.gt]: todayStart,
          [Op.lt]: now
        },
      }
    })

    for (let indicator of indicators) {
      let newRecord = await db.Report.create({
        report_name: `${reportYear}-${reportMonth}-${reportDay} Monthly Report`,
        user_id: 1,
        indicator_data_id: indicator.id
      });
      newRecords.push(newRecord);
    }

    res.status(201).json({
      message: "Report records created successfully", newRecords
    })
  } catch (e) {
    console.error(e);
    throw e;
  }
});
