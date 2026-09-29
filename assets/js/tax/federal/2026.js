// IRS Publication 15-T (2026), Worksheet 1A and Annual Percentage Method table.
// Keep this file year-specific. A future tax year should add a sibling config.
const rows = (...values) => values.map(([floor, ceiling, base, rate]) => ({ floor, ceiling, base, rate }));

export const FEDERAL_TAX_CONFIG_2026 = Object.freeze({
  year: 2026,
  payPeriods: Object.freeze({ weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12, annual: 1 }),
  worksheetAdjustment: Object.freeze({ single: 8600, married: 12900, head: 8600 }),
  fica: Object.freeze({
    socialSecurityRate: 0.062,
    socialSecurityWageBase: 184500,
    medicareRate: 0.0145,
    additionalMedicareRate: 0.009,
    additionalMedicareThreshold: 200000
  }),
  schedules: Object.freeze({
    standard: Object.freeze({
      married: rows(
        [0,19300,0,0],[19300,44100,0,.10],[44100,120100,2480,.12],[120100,230700,11600,.22],
        [230700,422850,35932,.24],[422850,531750,82048,.32],[531750,788000,116896,.35],[788000,Infinity,206583.50,.37]
      ),
      single: rows(
        [0,7500,0,0],[7500,19900,0,.10],[19900,57900,1240,.12],[57900,113200,5800,.22],
        [113200,209275,17966,.24],[209275,263725,41024,.32],[263725,648100,58448,.35],[648100,Infinity,192979.25,.37]
      ),
      head: rows(
        [0,15550,0,0],[15550,33250,0,.10],[33250,83000,1770,.12],[83000,121250,7740,.22],
        [121250,217300,16155,.24],[217300,271750,39207,.32],[271750,656150,56631,.35],[656150,Infinity,191171,.37]
      )
    }),
    step2: Object.freeze({
      married: rows(
        [0,16100,0,0],[16100,28500,0,.10],[28500,66500,1240,.12],[66500,121800,5800,.22],
        [121800,217875,17966,.24],[217875,272325,41024,.32],[272325,400450,58448,.35],[400450,Infinity,103291.75,.37]
      ),
      single: rows(
        [0,8050,0,0],[8050,14250,0,.10],[14250,33250,620,.12],[33250,60900,2900,.22],
        [60900,108938,8983,.24],[108938,136163,20512,.32],[136163,328350,29224,.35],[328350,Infinity,96489.63,.37]
      ),
      head: rows(
        [0,12075,0,0],[12075,20925,0,.10],[20925,45800,885,.12],[45800,64925,3870,.22],
        [64925,112950,8077.50,.24],[112950,140175,19603.50,.32],[140175,332375,28315.50,.35],[332375,Infinity,95585.50,.37]
      )
    })
  })
});
