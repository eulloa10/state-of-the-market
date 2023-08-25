import { AxiosResponse } from 'axios';

interface FREDDataPoint {
  realtime_start: string,
  realtime_end: string,
  date: string,
  value: number
}

export function FRED_data_formatter(fredData: AxiosResponse) {
  let allData = fredData.data.observations;
  let standardizedData = allData.map((observation: FREDDataPoint) => {
    return {
      date: observation.date,
      value: observation.value
    }
  })
  return standardizedData;
}
