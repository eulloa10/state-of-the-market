import ExcelJS from 'exceljs';
import {
  ReportData
} from "../types/interfaces";
import db from '../db/models';

export default async function createExcelReport(reportData: ReportData) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'State of the Market';
  workbook.created = new Date();
  workbook.calcProperties.fullCalcOnLoad = true;

  const summarySheet = workbook.addWorksheet('Indicator - MoM Comparison');
  summarySheet.columns = [{
      header: 'Indicator',
      key: 'indicator',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Current Period',
      key: 'currentPeriod'
    },
    {
      header: 'Prior Period',
      key: 'priorPeriod'
    },
    {
      header: 'CP Value',
      key: 'cpValue',
    },
    {
      header: 'PP Value',
      key: 'ppValue'
    },
    {
      header: 'Delta',
      key: 'delta'
    },
  ];

  let index = 0;

  for (let indicator in reportData) {
    const change = (Number(reportData[indicator].recent.indicatorValue) - Number(reportData[indicator].prior.indicatorValue)) / Number(reportData[indicator].prior.indicatorValue);

    const indicatorReferenceData = await db.Indicator_Reference.findByPk(indicator);
    const indicatorName = indicatorReferenceData.dataValues.abbr_name

    summarySheet.addRow({
      id: indicator,
      indicator: indicatorName,
      currentPeriod: reportData[indicator].recent.indicatorDate,
      priorPeriod: reportData[indicator].prior.indicatorDate,
      cpValue: reportData[indicator].recent.indicatorValue,
      ppValue: reportData[indicator].prior.indicatorValue,
      delta: change
    });

    index++;
  }

  let newWorkbook = workbook.xlsx
   .writeFile('econIndicators.xlsx')

  return workbook;
}
