export function getLastDayOfMonth (month: string, year: string) {
  let lastDay = new Date(Number(year), Number(month), 0).getDate();
  return String(lastDay);
}
