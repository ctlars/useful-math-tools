# Architecture Notes

## Payroll

```text
assets/js/tax/
└── federal/
    ├── 2026.js        year-specific data
    ├── withholding.js Worksheet 1A engine
    ├── fica.js        Social Security and Medicare engine
    └── payroll.js     take-home orchestration
```

The UI calls the payroll orchestrator and does not contain tax constants. A future year adds a sibling data module. State and local modules can later sit beside `federal` without changing the federal engine.

## Household budget

`budget-engine.js` owns frequency normalization and summaries. `household-budget.js` owns DOM rows, local saving, category visualization, and copy output. The stored model has `version`, `name`, `income[]`, and `expenses[]`. Each row carries an ID, label, amount, and frequency; expense rows also carry category and 50/30/20 classification.

The top-level `name` and versioned model leave room for future current/Scenario A/Scenario B containers without building scenario management now.
