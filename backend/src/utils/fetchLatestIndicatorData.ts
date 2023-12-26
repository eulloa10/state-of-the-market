import calcAvgIndicatorValue from './calcAvgIndicatorValue';
import extractDateFromRecord from './extractDateFromRecord';
import fetchIndicatorData from './fetchIndicatorData';

export default async function fetchLatestIndicatorData(indicatorName: string) {
  try {
    // Fetch all data to get the latest record
    const allIndicatorData = await fetchIndicatorData(indicatorName);

    // Get date of latest record
    const latestRecord = allIndicatorData[0];
    const { year, month, day} = extractDateFromRecord(latestRecord.date);
    const observation_start = `${year}-${month}-01`;
    const observation_end = `${year}-${month}-${day}`;

    // Fetch all data between the the first of the month and the date of the latest record
    const latestIndicatorData = await fetchIndicatorData(indicatorName, observation_start, observation_end);

    // Run the data through the average calculation function
    const dailyAverage = calcAvgIndicatorValue(latestIndicatorData);

    // Return a date with the first day of the month as the date and the average value generated
    return {
      "date": `${year}-${month}-01`,
      "value": dailyAverage
    }
  } catch (e) {
    console.error('Error fetching latest indicator data:', e);
    throw new Error('An error occurred while fetching latest indicator data');
  }
}
