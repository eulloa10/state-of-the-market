import axios from 'axios';
import * as indicatorReference from '../data/indicatorReference.json';
import {
  Indicators
} from '../types/interfaces';

const indicators: Indicators = indicatorReference;


export function getLastDayOfMonth(month: string, year: string) {
  let lastDay = new Date(Number(year), Number(month), 0).getDate();
  return String(lastDay);
}

export async function getMostRecentIndicatorDate(indicatorName: string, period: string) {
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

function getPreviousMonthAndYear(year: string, month: string) {
  const currentMonth = Number(month);
  const currentYear = Number(year);

  let previousYear, previousMonth;

  if (currentMonth === 1) {
    previousMonth = 12;
    previousYear = currentYear - 1;
  } else {
    previousMonth = currentMonth - 1;
    previousYear = currentYear;
  }

  return [String(previousYear), ("0" + previousMonth).slice(-2)];
}
