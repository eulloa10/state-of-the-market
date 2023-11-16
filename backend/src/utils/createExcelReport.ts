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
          horizontal: 'center'
        }
      },
      width: 35
    },
    {
      header: 'Current Period',
      key: 'currentPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        }
      },
      width: 12
    },
    {
      header: 'Prior Period',
      key: 'priorPeriod',
      style: {
        alignment: {
          horizontal: 'center'
        }
      },
      width: 12
    },
    {
      header: 'CP Value',
      key: 'cpValue',
      style: {
        alignment: {
          horizontal: 'center'
        },
        numFmt: '#,##0.00'
      },
      width: 9
    },
    {
      header: 'PP Value',
      key: 'ppValue',
      style: {
        alignment: {
          horizontal: 'center'
        },
        numFmt: '#,##0.00'
      },
      width: 9
    },
    {
      header: 'Delta',
      key: 'delta',
      style: {
        alignment: {
          horizontal: 'center'
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
          horizontal: 'center'
        }
      },
      width: 30
    },
    {
      header: 'Description',
      key: 'description',
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
    const indicatorName = indicatorReferenceData.dataValues.abbr_name;
    const indicatorDescription = indicatorReferenceData.dataValues.description;

    summarySheet.addRow({
      id: indicator,
      indicator: indicatorName,
      currentPeriod: reportData[indicator].recent.indicatorDate,
      priorPeriod: reportData[indicator].prior.indicatorDate,
      cpValue: reportData[indicator].recent.indicatorValue,
      ppValue: reportData[indicator].prior.indicatorValue,
      delta: change
    });

    indicatorDescriptionSheet.addRow({
      indicator: indicatorName,
      description: indicatorDescription
    })

    summarySheet.getRow(Number(indicator) + 1).alignment = {
      horizontal: 'center',
    }

    // summarySheet.getRow(Number(indicator) + 1).numFmt = '#,##0.00';

    index++;
  }

  let excelReportName =  `State of the Market Report - ${month} ${year}.xlsx`;

  // const buffer = await workbook.xlsx.writeBuffer();
  // console.log(buffer);
  await workbook.xlsx.writeFile(excelReportName)


  // await uploadToBucket(excelReportName, buffer);

  // return buffer;
}
