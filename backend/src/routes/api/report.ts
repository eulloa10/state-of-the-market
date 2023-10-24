import express, {
  NextFunction,
  Request,
  Response
} from 'express';
import * as dotenv from 'dotenv';
import db from '../../db/models';
import {
  Op
} from "sequelize";
import formatReportData from '../../utils/formatReportData';
import createExcelReport from '../../utils/createExcelReport';

dotenv.config();

export const reportRouter = express.Router();

reportRouter.get('/', async (req: Request, res: Response) => {
  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1;
  const reportDay = now.getDate();

  const indicatorData = await db.Report.findAll({
    where: {
      report_name: `${reportYear}-${reportMonth}-${19} Monthly Report`
    },
    include: db.Indicator
  })

  const reportData = formatReportData(indicatorData);
  console.log("REPORT DATA CHECK", reportData)
  // console.log("REPORT DATA: ", reportData)
  const excelReport = await createExcelReport(reportData)
  // console.log("EXCELREPORT: ", excelReport)
  // TODO: Convert data to xlsx and then save it to S3 AWS bucket
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
