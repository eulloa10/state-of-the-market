import axios from 'axios';
import { FRED_API_URL, FILE_TYPE, SORT_ORDER } from '../constants';
import {
  Indicators
} from '../types/interfaces';
import indicatorReference from '../data/indicatorReference.json';

const indicators: Indicators = indicatorReference;

export default async function fetchIndicatorData(indicatorName: string, observation_start?: string, observation_end?: string) {
  try {
    const indicatorData = await axios.get(FRED_API_URL, {
      params: {
        observation_start: observation_start,
        observation_end: observation_end,
        series_id: indicators[indicatorName].seriesId,
        file_type: FILE_TYPE,
        sort_order: SORT_ORDER,
        api_key: process.env.FRED_API_KEY
      }
    })

    return indicatorData.data.observations;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
