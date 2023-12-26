export default function extractDateFromRecord(date: string) {
  const dateComponents = date.split("-");
  const year = dateComponents[0];
  const month = dateComponents[1];
  const day = dateComponents[2];
  return { year, month, day };
}
