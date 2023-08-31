import axios from 'axios';
import * as dotenv from 'dotenv';
import * as indicatorReference from '../data/indicatorReference.json';
import { Indicators } from '../routes/types/interfaces';
const indicators: Indicators = indicatorReference;


export function getLastDayOfMonth (month: string, year: string) {
  let lastDay = new Date(Number(year), Number(month), 0).getDate();
  return String(lastDay);
}

export async function getMostRecentIndicatorDate(indicatorName: string) {
  try {
  const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
    params: {
      series_id: indicators[indicatorName].seriesId,
      file_type: 'json',
      sort_order: 'desc',
      api_key: process.env.FRED_API_KEY
    }
  })
  const [year, month] = indicatorData.data.observations[0].date.split('-')
  return [year, month]
} catch (e) {
  console.error(e);
  throw e;
}
}
