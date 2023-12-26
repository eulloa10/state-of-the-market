# Details

Date : 2023-12-26 00:28:23

Directory /Users/edgarulloa/Documents/Projects/state-of-the-market

Total : 58 files,  8381 codes, 148 comments, 246 blanks, all 8775 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [backend/package.json](/backend/package.json) | JSON | 35 | 0 | 1 | 36 |
| [backend/src/app.ts](/backend/src/app.ts) | TypeScript | 12 | 3 | 6 | 21 |
| [backend/src/aws/s3/s3_getobject.js](/backend/src/aws/s3/s3_getobject.js) | JavaScript | 21 | 1 | 5 | 27 |
| [backend/src/aws/s3/s3_listbuckets.js](/backend/src/aws/s3/s3_listbuckets.js) | JavaScript | 22 | 0 | 5 | 27 |
| [backend/src/aws/s3/s3_uploadtobucket.js](/backend/src/aws/s3/s3_uploadtobucket.js) | JavaScript | 22 | 0 | 5 | 27 |
| [backend/src/constants.ts](/backend/src/constants.ts) | TypeScript | 3 | 3 | 3 | 9 |
| [backend/src/data/IndicatorDetails.ts](/backend/src/data/IndicatorDetails.ts) | TypeScript | 68 | 0 | 1 | 69 |
| [backend/src/data/indicatorReference.json](/backend/src/data/indicatorReference.json) | JSON | 46 | 0 | 1 | 47 |
| [backend/src/db/config/config.js](/backend/src/db/config/config.js) | JavaScript | 24 | 0 | 2 | 26 |
| [backend/src/db/migrations/20230907063424-create-user.js](/backend/src/db/migrations/20230907063424-create-user.js) | JavaScript | 40 | 1 | 1 | 42 |
| [backend/src/db/migrations/20230907071328-create-report.js](/backend/src/db/migrations/20230907071328-create-report.js) | JavaScript | 38 | 1 | 1 | 40 |
| [backend/src/db/migrations/20230907204112-create-indicator.js](/backend/src/db/migrations/20230907204112-create-indicator.js) | JavaScript | 44 | 1 | 2 | 47 |
| [backend/src/db/migrations/20230907210022-create-indicator-reference.js](/backend/src/db/migrations/20230907210022-create-indicator-reference.js) | JavaScript | 42 | 1 | 1 | 44 |
| [backend/src/db/models/index.ts](/backend/src/db/models/index.ts) | TypeScript | 36 | 1 | 7 | 44 |
| [backend/src/db/models/indicator.ts](/backend/src/db/models/indicator.ts) | TypeScript | 45 | 0 | 6 | 51 |
| [backend/src/db/models/indicator_reference.ts](/backend/src/db/models/indicator_reference.ts) | TypeScript | 46 | 0 | 4 | 50 |
| [backend/src/db/models/report.ts](/backend/src/db/models/report.ts) | TypeScript | 46 | 0 | 5 | 51 |
| [backend/src/db/models/user.ts](/backend/src/db/models/user.ts) | TypeScript | 43 | 0 | 5 | 48 |
| [backend/src/db/seeders/20230907212613-indicator_reference_data.js](/backend/src/db/seeders/20230907212613-indicator_reference_data.js) | JavaScript | 75 | 16 | 3 | 94 |
| [backend/src/routes/api/index.ts](/backend/src/routes/api/index.ts) | TypeScript | 9 | 1 | 3 | 13 |
| [backend/src/routes/api/indicator.ts](/backend/src/routes/api/indicator.ts) | TypeScript | 138 | 5 | 22 | 165 |
| [backend/src/routes/api/report.ts](/backend/src/routes/api/report.ts) | TypeScript | 71 | 4 | 12 | 87 |
| [backend/src/routes/api/smtpserver.ts](/backend/src/routes/api/smtpserver.ts) | TypeScript | 34 | 13 | 13 | 60 |
| [backend/src/routes/index.ts](/backend/src/routes/index.ts) | TypeScript | 15 | 0 | 3 | 18 |
| [backend/src/routes/middleware/queryPriorIndicatorData.ts](/backend/src/routes/middleware/queryPriorIndicatorData.ts) | TypeScript | 33 | 0 | 4 | 37 |
| [backend/src/routes/middleware/queryRecentIndicatorData.ts](/backend/src/routes/middleware/queryRecentIndicatorData.ts) | TypeScript | 34 | 0 | 4 | 38 |
| [backend/src/routes/middleware/querySelectedIndicatorData.ts](/backend/src/routes/middleware/querySelectedIndicatorData.ts) | TypeScript | 36 | 0 | 4 | 40 |
| [backend/src/routes/middleware/validateIndicatorParam.ts](/backend/src/routes/middleware/validateIndicatorParam.ts) | TypeScript | 17 | 0 | 2 | 19 |
| [backend/src/routes/middleware/validatePeriodParam.ts](/backend/src/routes/middleware/validatePeriodParam.ts) | TypeScript | 18 | 0 | 2 | 20 |
| [backend/src/types/express/index.d.ts](/backend/src/types/express/index.d.ts) | TypeScript | 8 | 0 | 2 | 10 |
| [backend/src/types/interfaces.ts](/backend/src/types/interfaces.ts) | TypeScript | 28 | 0 | 4 | 32 |
| [backend/src/utils/calcAvgIndicatorValue.ts](/backend/src/utils/calcAvgIndicatorValue.ts) | TypeScript | 17 | 0 | 7 | 24 |
| [backend/src/utils/createExcelReport.ts](/backend/src/utils/createExcelReport.ts) | TypeScript | 143 | 1 | 18 | 162 |
| [backend/src/utils/extractDateFromRecord.ts](/backend/src/utils/extractDateFromRecord.ts) | TypeScript | 7 | 0 | 1 | 8 |
| [backend/src/utils/extractPeriodInfo.ts](/backend/src/utils/extractPeriodInfo.ts) | TypeScript | 11 | 0 | 3 | 14 |
| [backend/src/utils/fetchIndicatorData.ts](/backend/src/utils/fetchIndicatorData.ts) | TypeScript | 25 | 0 | 4 | 29 |
| [backend/src/utils/fetchLatestIndicatorData.ts](/backend/src/utils/fetchLatestIndicatorData.ts) | TypeScript | 21 | 5 | 6 | 32 |
| [backend/src/utils/fetchPriorIndicatorData.ts](/backend/src/utils/fetchPriorIndicatorData.ts) | TypeScript | 25 | 5 | 6 | 36 |
| [backend/src/utils/formatReportData.ts](/backend/src/utils/formatReportData.ts) | TypeScript | 36 | 1 | 6 | 43 |
| [backend/src/utils/fredDataFormatter.ts](/backend/src/utils/fredDataFormatter.ts) | TypeScript | 17 | 0 | 3 | 20 |
| [backend/src/utils/getIndicatorDate.ts](/backend/src/utils/getIndicatorDate.ts) | TypeScript | 28 | 0 | 5 | 33 |
| [backend/src/utils/getLastDayOfMonth.ts](/backend/src/utils/getLastDayOfMonth.ts) | TypeScript | 4 | 0 | 1 | 5 |
| [backend/src/utils/getPreviousMonthAndYear.ts](/backend/src/utils/getPreviousMonthAndYear.ts) | TypeScript | 13 | 0 | 4 | 17 |
| [backend/src/utils/parseIndicatorName.ts](/backend/src/utils/parseIndicatorName.ts) | TypeScript | 5 | 0 | 1 | 6 |
| [backend/tsconfig.json](/backend/tsconfig.json) | JSON with Comments | 18 | 84 | 9 | 111 |
| [frontend/.eslintrc.json](/frontend/.eslintrc.json) | JSON with Comments | 3 | 0 | 1 | 4 |
| [frontend/README.md](/frontend/README.md) | Markdown | 21 | 0 | 14 | 35 |
| [frontend/next.config.js](/frontend/next.config.js) | JavaScript | 2 | 1 | 2 | 5 |
| [frontend/package-lock.json](/frontend/package-lock.json) | JSON | 6,708 | 0 | 1 | 6,709 |
| [frontend/package.json](/frontend/package.json) | JSON | 25 | 0 | 1 | 26 |
| [frontend/postcss.config.js](/frontend/postcss.config.js) | JavaScript | 6 | 0 | 1 | 7 |
| [frontend/public/next.svg](/frontend/public/next.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/public/vercel.svg](/frontend/public/vercel.svg) | XML | 1 | 0 | 0 | 1 |
| [frontend/src/app/globals.css](/frontend/src/app/globals.css) | CSS | 24 | 0 | 4 | 28 |
| [frontend/src/app/layout.tsx](/frontend/src/app/layout.tsx) | TypeScript JSX | 21 | 0 | 4 | 25 |
| [frontend/src/app/page.tsx](/frontend/src/app/page.tsx) | TypeScript JSX | 4 | 0 | 2 | 6 |
| [frontend/tailwind.config.ts](/frontend/tailwind.config.ts) | TypeScript | 19 | 0 | 2 | 21 |
| [frontend/tsconfig.json](/frontend/tsconfig.json) | JSON with Comments | 27 | 0 | 1 | 28 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)