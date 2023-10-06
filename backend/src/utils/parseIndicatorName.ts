export default function parseIndicatorName(reqBaseUrl: string) {
  const baseURL = reqBaseUrl.split('/');
  const indicatorName = baseURL[baseURL.length - 1];
  return indicatorName;
}
