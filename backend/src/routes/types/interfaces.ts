export interface Indicators {
  [key: string]: {
    seriesId: string;
    frequency: string;
  };
}

export interface FREDDataPoint {
  realtime_start: string,
  realtime_end: string,
  date: string,
  value: number
}
