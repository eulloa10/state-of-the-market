import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import * as dotenv from 'dotenv';
import indicatorReference from '../../data/indicatorReference.json';
import {
  Indicators,
  ReportData
} from '../../types/interfaces';
import db from '../../db/models';
import {
  Op
} from "sequelize";

dotenv.config();

export const reportRouter = express.Router();



reportRouter.get('/', async (req: Request, res: Response) => {
  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1;
  const reportDay = now.getDate();

  const reportData: ReportData = {};

  const indicatorData = await db.Report.findAll({
    where: {
      report_name: `${reportYear}-${reportMonth}-${reportDay} Monthly Report`
    },
    include: db.Indicator
  })

  for (let data of indicatorData) {
    let indicatorId = data.dataValues.Indicator.indicator_reference_id;
    let indicatorValue = data.dataValues.Indicator.indicator_value;
    let indicatorDate = data.dataValues.Indicator.indicator_date;

    if (!reportData[indicatorId]) {
      reportData[indicatorId] = {
        prior: {
          indicatorDate: '',
          indicatorValue: '',
        },
        recent: {
          indicatorDate,
          indicatorValue
        },
      };
    } else {
      let date1 = Date.parse(indicatorDate);
      let date2 = Date.parse(reportData[indicatorId].recent.indicatorDate);

      if (date1 > date2) {
        reportData[indicatorId].prior = {
          indicatorDate: reportData[indicatorId].recent.indicatorDate,
          indicatorValue: reportData[indicatorId].recent.indicatorValue,
        };

        // Update "recent" with the new data
        reportData[indicatorId].recent.indicatorDate = indicatorDate;
        reportData[indicatorId].recent.indicatorValue = indicatorValue;
      } else {
        reportData[indicatorId].prior.indicatorDate = indicatorDate;
        reportData[indicatorId].prior.indicatorValue = indicatorValue;
      }
    }
  }
  res.json(reportData);
})

// Add error handling in the event that the recent and prior data
// does not exist yet
reportRouter.post('/', async (req: Request, res: Response) => {
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
      message: "Report records created successfully",
      newRecords
    })
  } catch (e) {
    console.error(e);
    throw e;
  }
});
