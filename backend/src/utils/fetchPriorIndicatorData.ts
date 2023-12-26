import calcAvgIndicatorValue from './calcAvgIndicatorValue';
import extractDateFromRecord from './extractDateFromRecord';
import fetchIndicatorData from './fetchIndicatorData';
import getLastDayOfMonth from './getLastDayOfMonth';
import getPreviousMonthAndYear from './getPreviousMonthAndYear';

export default async function fetchPriorIndicatorData(indicatorName: string) {
  try {
    // Fetch all data to get the latest record
    const allIndicatorData = await fetchIndicatorData(indicatorName);

    // Get the month prior to the latest record
    const latestRecord = allIndicatorData[0];
    const { year, month, day} = extractDateFromRecord(latestRecord.date);
    const [priorPeriodYear, priorPeriodMonth] = getPreviousMonthAndYear(year, month);
    const priorPeriodLastDay = getLastDayOfMonth(priorPeriodMonth, priorPeriodYear);
    const observation_start = `${priorPeriodYear}-${[priorPeriodMonth]}-01`;
    const observation_end = `${priorPeriodYear}-${[priorPeriodMonth]}-${priorPeriodLastDay}`;

    // Fetch all data between the the first of the prior month and the last day of the prior month
    const priorPeriodData = await fetchIndicatorData(indicatorName, observation_start, observation_end);

    // Run the data through the average calculation function
    const dailyAverage = calcAvgIndicatorValue(priorPeriodData);

    // Return a date with the first day of the prior month as the date and the average value generated
    return {
      date: `${priorPeriodYear}-${priorPeriodMonth}-01`,
      value: dailyAverage
    }
  } catch (e) {
    console.error('Error fetching prior period indicator data:', e);
    throw new Error('An error occurred while fetching prior period indicator data');
  }
}
