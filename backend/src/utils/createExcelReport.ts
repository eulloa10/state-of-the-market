import ExcelJS from 'exceljs';
import {
  ReportData
} from "../types/interfaces";
import db from '../db/models';
import { uploadToBucket } from '../aws/s3/s3_uploadtobucket';

export default async function createExcelReport(reportData: ReportData) {
  let date = new Date();
  let month = date.toLocaleString('default', {
    month: 'short'
  })
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
          horizontal: 'left'
        }
      },
      width: 35
    },
    {
      header: 'Current Period (CP)',
      key: 'currentPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        },
        numFmt: 'mmm yyyy'
      },
      width: 16
    },
    {
      header: 'Prior Period (PP)',
      key: 'priorPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        },
        numFmt: 'mmm yyyy'
      },
      width: 16
    },
    {
      header: 'CP Value',
      key: 'cpValue',
      style: {
        alignment: {
          horizontal: 'right'
        },
        numFmt: '#,##0.00'
      },
      width: 10
    },
    {
      header: 'PP Value',
      key: 'ppValue',
      style: {
        alignment: {
          horizontal: 'right'
        },
        numFmt: '#,##0.00'
      },
      width: 10
    },
    {
      header: 'Delta',
      key: 'delta',
      style: {
        alignment: {
          horizontal: 'right'
        },
        numFmt: '0.00%'
      },
      width: 9
    },
  ];

  const indicatorDescriptionSheet = workbook.addWorksheet('Indicator Descriptions');

  indicatorDescriptionSheet.columns = [{
      header: 'Indicator',
      key: 'indicator',
      style: {
        alignment: {
          horizontal: 'left',
          vertical: 'middle'
        }
      },
      width: 30
    },
    {
      header: 'Description',
      key: 'description',
      style: {
        alignment: {
          horizontal: 'left',
          vertical: 'middle',
          wrapText: true
        }
      },
      width: 100
    },
  ];


  let index = 0;
  for (let indicator in reportData) {
    const change = (Number(reportData[indicator].recent.indicatorValue) - Number(reportData[indicator].prior.indicatorValue)) / Number(reportData[indicator].prior.indicatorValue);

    const indicatorReferenceData = await db.Indicator_Reference.findByPk(indicator);
    const indicatorName = indicatorReferenceData.dataValues.abbr_name;
    const indicatorDescription = indicatorReferenceData.dataValues.description;
    const recentIndicatorDate = new Date(reportData[indicator].recent.indicatorDate)
    const priorIndicatorDate = new Date(reportData[indicator].prior.indicatorDate)

    summarySheet.addRow({
      id: indicator,
      indicator: indicatorName,
      currentPeriod: recentIndicatorDate,
      priorPeriod: priorIndicatorDate,
      cpValue: reportData[indicator].recent.indicatorValue,
      ppValue: reportData[indicator].prior.indicatorValue,
      delta: change
    });

    indicatorDescriptionSheet.addRow({
      indicator: indicatorName,
      description: indicatorDescription
    })

    index++;
  }

  summarySheet.getRow(1).alignment = {
    horizontal: 'center',
  }

  indicatorDescriptionSheet.getRow(1).alignment = {
    horizontal: 'center',
  }

  let excelReportName =  `State of the Market Report - ${month} ${year}.xlsx`;

  const buffer = await workbook.xlsx.writeBuffer();

  await uploadToBucket(excelReportName, buffer);

  return buffer;
}
