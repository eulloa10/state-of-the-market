import { ReportData } from "../types/interfaces";

export default function formatReportData(indicatorData: any) {
  const reportData: ReportData = {};

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
  return reportData;
}
