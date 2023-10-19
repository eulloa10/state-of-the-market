import ExcelJS from 'exceljs';
import {
  ReportData
} from "../types/interfaces";
import db from '../db/models';

export default async function createExcelReport(reportData: ReportData) {
  let date = new Date();
  let month = date.toLocaleString('default', { month: 'short' })
  let year = date.getFullYear();

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
      key: 'currentPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Prior Period',
      key: 'priorPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'CP Value',
      key: 'cpValue',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'PP Value',
      key: 'ppValue',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
    },
    {
      header: 'Delta',
      key: 'delta',
      style: {
        alignment: {
          horizontal: 'center'
        }
      }
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

    summarySheet.getRow(Number(indicator) + 1).alignment = {
      horizontal: 'left'
    }

    index++;
  }



  let newWorkbook = workbook.xlsx
   .writeFile(`State of the Market Report - ${month} ${year}.xlsx`)

  return workbook;
}
