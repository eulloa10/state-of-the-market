import { FREDDataPoint } from "../types/interfaces";

interface IndicatorDataObservations extends Array<FREDDataPoint>{}

export default function calcAvgIndicatorValue(indicatorDataObservations: IndicatorDataObservations) {
    let invalidValues = 0;

    const dailyConsolidation = indicatorDataObservations.reduce((acc: number, obj: FREDDataPoint) => {
      if (String(obj.value) === ".") {
        invalidValues++;
        return acc;
      }
      return acc + Number(obj.value)
    }, 0)

    let dailyAverage = (dailyConsolidation / (indicatorDataObservations.length - invalidValues)).toFixed(2)

    if (dailyConsolidation === 0) {
      dailyAverage = "Value not reported"
    }

    return dailyAverage;
}
