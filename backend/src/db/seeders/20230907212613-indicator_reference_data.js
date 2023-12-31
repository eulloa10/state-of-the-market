'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert('Indicator_References', [{
        'full_name': 'Yield Curve',
        'abbr_name': 'Yield Curve',
        'series_id': 'DGS10',
        'description': '10-year yield estimated from the average yields of a variety of Treasury securities with different maturities derived from the Treasury yield curve.'
      },
      {
        'full_name': 'Effective Federal Funds Rate',
        'abbr_name': 'Federal Funds Rate',
        'series_id': 'EFFR',
        'description': 'Effective Federal Funds Rate, or the interest rate depository institutions charge each other for overnight loans of funds.'
      },
      {
        'full_name': 'S&P/Case-Shiller U.S. National Home Price Index',
        'abbr_name': 'Case-Shiller Index',
        'series_id': 'CSUSHPINSA',
        'description': 'A benchmark of average single-family home prices in the U.S., calculated monthly based on changes in home prices over the prior three months.'
      },
      {
        'full_name': 'Unemployment Rate',
        'abbr_name': 'Unemployment Rate',
        'series_id': 'UNRATE',
        'description': 'The number of people 16 and over actively searching for a job as a percentage of the total labor force.'
      },
      {
        'full_name': 'Consumer Price Index for All Urban Consumers: All Items in U.S. City Average',
        'abbr_name': 'CPI',
        'series_id': 'CPIAUCSL',
        'description': 'An inflation measure derived from tracking the changes in the weighted-average price of a basket of common goods and services.'
      },
      {
        'full_name': 'Personal Consumption Expenditures',
        'abbr_name': 'Personal Consumption Expenditures',
        'series_id': 'PCE',
        'description': 'An index that measures monthly changes in the price of consumer goods and services as a means of analyzing inflation.'
      },
      {
        'full_name': 'Job Openings: Total Nonfarm',
        'abbr_name': 'JOLTS Openings (Nonfarm)',
        'series_id': 'JTSJOL',
        'description': 'A measure of all jobs that are not filled on the last business day of the month. A job is considered open if a specific position exists and there is work available for it, the job can be started within 30 days, and there is active recruiting for the position.'
      },
      {
        'full_name': 'Hires: Total Nonfarm',
        'abbr_name': 'JOLTS Hires (Nonfarm)',
        'series_id': 'JTSHIR',
        'description': 'Workers hired'
      },
      {
        'full_name': 'Total Separations: Total Nonfarm',
        'abbr_name': 'JOLTS Turnover (Nonfarm)',
        'series_id': 'JTSTSR',
        'description': 'Workers that quit their job, were laid off, or experienced other separations (including worker deaths)'
      },
      {
        'full_name': 'Personal Saving Rate',
        'abbr_name': 'Personal Saving Rate',
        'series_id': 'PSAVERT',
        'description': 'Personal saving as a percentage of disposable personal income (DPI), frequently referred to as "the personal saving rate," is calculated as the ratio of personal saving to DPI. Personal saving is equal to personal income less personal outlays and personal taxes; it may generally be viewed as the portion of personal income that is used either to provide funds to capital markets or to invest in real assets such as residences.'
      },
      {
        'full_name': 'Consumer Opinion Surveys: Confidence Indicators: Composite Indicators: OECD Indicator for the United States',
        'abbr_name': 'Consumer Confidence',
        'series_id': 'CSCICP03USM665S',
        'description': 'Provides an indication of future developments of households\' consumption and saving, based upon answers regarding their expected financial situation, their sentiment about the general economic situation, unemployment and capability of savings.'
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Indicator_References', null, {});
  }
};
