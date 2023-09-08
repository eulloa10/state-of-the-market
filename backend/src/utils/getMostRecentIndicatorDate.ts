import axios from 'axios';
import * as indicatorReference from '../data/indicatorReference.json';
import {
  Indicators
} from '../types/interfaces';
import getPreviousMonthAndYear from './getPreviousMonthAndYear';

const indicators: Indicators = indicatorReference;

export default async function getMostRecentIndicatorDate(indicatorName: string, period: string) {
  try {
    const indicatorData = await axios.get('https://api.stlouisfed.org/fred/series/observations', {
      params: {
        series_id: indicators[indicatorName].seriesId,
        file_type: 'json',
        sort_order: 'desc',
        api_key: process.env.FRED_API_KEY
      }
    });

    let year, month;

    [year, month] = indicatorData.data.observations[0].date.split('-');
    if (period != 'recent') {
      [year, month] = getPreviousMonthAndYear(year, month);
    }
    return [year, month]
  } catch (e) {
    console.error(e);
    throw e;
  }
}
