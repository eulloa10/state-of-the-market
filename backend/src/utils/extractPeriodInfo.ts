import getLastDayOfMonth from "./getLastDayOfMonth";

export default function extractPeriodInfo(period: string) {
  const periodYear = period.slice(2);
  const periodMonth = period.slice(0,2);
  const periodLastDay = getLastDayOfMonth(periodMonth, periodYear);
  const observation_start = `${periodYear}-${periodMonth}-01`;
  const observation_end = `${periodYear}-${periodMonth}-${periodLastDay}`;

  return {
    periodYear, periodMonth, observation_start, observation_end
  }
}
