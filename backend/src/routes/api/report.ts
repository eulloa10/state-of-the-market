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

// Generates monthly report and returns it
reportRouter.get('/monthly', async (req: Request, res: Response) => {
  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1;
  const reportDay = '01'
  const reportName = `${reportYear}-${reportMonth}-${reportDay} Monthly Report`

  try {
    const indicatorData = await db.Report.findAll({
      where: {
        report_name: reportName
      },
      include: db.Indicator
    });

    const reportData = formatReportData(indicatorData);
    const excelReport = await createExcelReport(reportData);

    console.log("EXCEL REPORT", excelReport)

    // TODO: Convert data to xlsx and then save it to S3 AWS bucket
    res.json(reportData);
  } catch (error) {
    console.error("Error generating monthly report:", error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
})

// TODO: Add error handling in the event that the recent and prior data
// does not exist yet
// Creates report for the current month
reportRouter.post('/monthly', async (req: Request, res: Response) => {
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const now = new Date();
  const reportYear = now.getFullYear();
  const reportMonth = now.getMonth() + 1;
  const reportDay = '01';
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  let newRecords = []

  try {
    const indicators = await db.Indicator.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate]
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
