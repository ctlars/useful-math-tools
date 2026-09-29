# Holiday Data

The business-day and deadline calculators use local JavaScript rules. No holiday API is called, and missing coverage is never treated as an empty holiday calendar.

## Coverage

- United States: federal holidays, 2020–2035, including standard observed-date handling.
- Canada: principal federal holidays, 2020–2035. Provincial holidays are not included.
- United Kingdom: England & Wales, Scotland, and Northern Ireland selections, 2020–2035. Standard bank holidays are included; one-off proclamations require manual verification.
- Australia: state/territory selections, 2020–2035. The current rules include nationwide holidays only; state, territory, and local observances must be verified.
- Mexico: selected national statutory holidays, 2020–2035.
- India: national gazetted holidays only, 2020–2035. State, religious, and local holidays are not included.
- China: official 2026 holiday periods and compensating weekend workdays.
- France, Germany, Spain, Italy, and the Netherlands: nationwide holidays, 2020–2035. Regional holidays are not included.
- Ireland and New Zealand: principal national holidays, 2020–2035.
- Singapore: fixed national holidays, 2020–2035. Lunar-calendar holidays are not included.

## China 2026 source and verification

The 2026 dates were checked against the State Council schedule as reproduced by the Beijing government’s English-language public-holiday page:

https://english.beijing.gov.cn/workinginbeijing/laborrights/publicholidays/

Included compensating workdays: February 14, February 28, May 9, September 20, and October 10, 2026.

## Method

Fixed-date holidays are generated locally. Weekday-based dates use calendar rules such as “third Monday” or “last Monday.” Easter-related dates use a Gregorian Easter calculation. Observed-date handling is applied only to calendars where it is part of the implemented rule set.

## Limitations

Holiday law, one-off proclamations, employer policies, emergency closures, and local observances can change. The calculator displays a coverage note for the chosen calendar. For a consequential deadline or payroll decision, verify dates with the responsible authority or organization.

China is deliberately limited to 2026 because compensating weekend workdays are issued in annual schedules. An unavailable year produces an error instead of silently assuming no holidays.

