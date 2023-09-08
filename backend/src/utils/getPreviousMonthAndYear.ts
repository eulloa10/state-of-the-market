export default function getPreviousMonthAndYear(year: string, month: string) {
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
