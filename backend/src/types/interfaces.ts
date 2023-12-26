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

export interface ReportData {
  [key: number]: {
    prior: {
      indicatorDate: string,
      indicatorValue: string
    },
    recent: {
      indicatorDate: string,
      indicatorValue: string
    }
  }
}

export interface CalculatedIndicatorData {
  date: string;
  value: string;
}

export interface IndicatorData {
  [key: string]: {
    date: string;
    value: number | string;
  };
};
