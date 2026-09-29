# Manual Test Cases

## 1. Days Between Dates
Calculator: Days Between Dates  
Inputs: September 29, 2026 to November 10, 2026; exclude start, include end  
Expected result: 42 days; 6 complete weeks  
Reason: Standard elapsed-date example.

## 2. Same Date
Calculator: Days Between Dates  
Inputs: Same start and end; exclude both  
Expected result: 0 days  
Reason: Same-day boundary.

## 3. Include Both Dates
Calculator: Days Between Dates  
Inputs: January 1 to January 3, 2026; include both  
Expected result: 3 days  
Reason: Inclusive counting.

## 4. Leap Day
Calculator: Days Between Dates  
Inputs: February 28 to March 1, 2024; conventional counting  
Expected result: 2 days  
Reason: Leap-year handling.

## 5. Add Days
Calculator: Add or Subtract a Date  
Inputs: September 29, 2026; 100 days after  
Expected result: January 7, 2027  
Reason: Crosses year boundary.

## 6. Subtract Weeks
Calculator: Add or Subtract a Date  
Inputs: June 1, 2027; 12 weeks before  
Expected result: March 9, 2027  
Reason: Backward weekly arithmetic.

## 7. End of Month
Calculator: Add or Subtract a Date  
Inputs: January 31, 2026; 1 month after  
Expected result: February 28, 2026  
Reason: Short target month.

## 8. Ordinary Business Week
Calculator: Business Days Between Dates  
Inputs: September 28–October 2, 2026; None; include both  
Expected result: 5 business days  
Reason: Monday-through-Friday baseline.

## 9. China Working Sunday
Calculator: Business Days Between Dates  
Inputs: September 20, 2026 only; China; include start  
Expected result: 1 business day  
Reason: Official compensating weekend workday.

## 10. China National Day
Calculator: Business Days Between Dates  
Inputs: October 1, 2026 only; China; include start  
Expected result: 0 business days  
Reason: Official holiday exclusion.

## 11. Unsupported China Year
Calculator: Business Days Between Dates  
Inputs: Any 2027 range; China  
Expected result: Clear unavailable-year message  
Reason: Missing data must not mean no holidays.

## 12. Business Deadline
Calculator: Deadline Calculator  
Inputs: Friday September 18, 2026; 1 business day after; no holiday calendar  
Expected result: Monday September 21, 2026  
Reason: Weekend skip.

## 13. Percentage Of
Calculator: Percentage Calculator  
Inputs: 15% of 240  
Expected result: 36  
Reason: Core percentage calculation.

## 14. Percent Ratio
Calculator: Percentage Calculator  
Inputs: 36 is what percent of 240  
Expected result: 15%  
Reason: Ratio mode.

## 15. Reverse Percentage
Calculator: Percentage Calculator  
Inputs: 36 is 15% of what number  
Expected result: 240  
Reason: Reverse mode.

## 16. Zero Denominator
Calculator: Percentage Calculator  
Inputs: 5 is what percent of 0  
Expected result: Clear denominator error  
Reason: Undefined operation.

## 17. Percentage Increase
Calculator: Percentage Change  
Inputs: 80 to 100  
Expected result: 25% increase; absolute change 20  
Reason: Brief example.

## 18. Percentage Decrease
Calculator: Percentage Change  
Inputs: 100 to 80  
Expected result: 20% decrease  
Reason: Direction handling.

## 19. Zero Starting Value
Calculator: Percentage Change  
Inputs: 0 to 10  
Expected result: Explanation that percentage change is undefined  
Reason: No valid denominator.

## 20. Symmetric Difference
Calculator: Percentage Difference  
Inputs: 80 and 100, then 100 and 80  
Expected result: 22.22% both times  
Reason: Symmetry.

## 21. Discount Without Tax
Calculator: Discount Calculator  
Inputs: $100, 20%, tax blank  
Expected result: $80 final price; $20 saved  
Reason: Basic discount.

## 22. Discount With Tax
Calculator: Discount Calculator  
Inputs: $100, 20%, 10% tax  
Expected result: $88 final price; $8 tax  
Reason: Tax applied after discount.

## 23. Tip Split
Calculator: Tip Calculator  
Inputs: $80, 20%, 2 people  
Expected result: $48 each; $16 total tip  
Reason: Bill splitting.

## 24. Average Mixed Separators
Calculator: Average Calculator  
Inputs: `1, 2` then line break, `3 4`  
Expected result: Mean 2.5; median 2.5; count 4  
Reason: Supported separators.

## 25. Invalid Average Entry
Calculator: Average Calculator  
Inputs: `1, apple, 3`  
Expected result: Identifies `apple` as invalid  
Reason: Human-readable validation.

## 26. Fraction Conversion
Calculator: Fraction, Decimal & Percent Converter  
Inputs: 3/4  
Expected result: 3/4; 0.75; 75%  
Reason: Standard conversion.

## 27. Decimal Conversion
Calculator: Fraction, Decimal & Percent Converter  
Inputs: 0.125  
Expected result: 1/8; 0.125; 12.5%  
Reason: Fraction reduction.

## 28. Zero Denominator Fraction
Calculator: Fraction, Decimal & Percent Converter  
Inputs: 3/0  
Expected result: Denominator error  
Reason: Division-by-zero protection.

## 29. Simplify Ratio
Calculator: Ratio & Proportion  
Inputs: 20 and 30  
Expected result: 2:3  
Reason: Greatest common divisor.

## 30. Solve Proportion
Calculator: Ratio & Proportion  
Inputs: 3/5 = blank/20  
Expected result: 12  
Reason: Cross multiplication.

## 31. Zero-Interest Loan
Calculator: Loan Payment  
Inputs: $1,200; 0%; 12 months  
Expected result: $100 monthly; $0 interest  
Reason: Zero-rate branch.

## 32. Standard Loan
Calculator: Loan Payment  
Inputs: $25,000; 6.5%; 5 years  
Expected result: Approximately $489.15 monthly  
Reason: Known amortization example.

## 33. Compound Without Contributions
Calculator: Compound Interest  
Inputs: $10,000; 5%; 10 years; monthly; $0 contribution  
Expected result: Approximately $16,470.09  
Reason: Standard compound growth.

## 34. Compound at Zero Rate
Calculator: Compound Interest  
Inputs: $1,000; 0%; 1 year; $100 monthly  
Expected result: $2,200  
Reason: Contributions without growth.

## 35. Length Conversion
Calculator: Length Converter  
Inputs: 1 meter to feet  
Expected result: Approximately 3.28084 feet  
Reason: Known constant.

## 36. Mile Conversion
Calculator: Length Converter  
Inputs: 1 mile to kilometers  
Expected result: 1.609344 kilometers  
Reason: Exact international mile.

## 37. Weight Conversion
Calculator: Weight & Mass Converter  
Inputs: 1 kilogram to pounds  
Expected result: Approximately 2.20462 pounds  
Reason: Known constant.

## 38. Stone Conversion
Calculator: Weight & Mass Converter  
Inputs: 1 stone to pounds  
Expected result: 14 pounds  
Reason: Exact relationship.

## 39. Temperature Conversion
Calculator: Temperature Converter  
Inputs: 20°C to Fahrenheit  
Expected result: 68°F  
Reason: Standard reference point.

## 40. Absolute Zero
Calculator: Temperature Converter  
Inputs: −274°C to Kelvin  
Expected result: Absolute-zero validation error  
Reason: Physical boundary.

## 41. Paint Estimate
Calculator: Paint Calculator  
Inputs: 12 × 10 × 8 ft; 1 door at 20 ft²; 2 windows at 15 ft²; 2 coats; 350 ft²/gal  
Expected result: Approximately 1.73 gallons; suggest 2 gallons  
Reason: Room geometry with openings.

## 42. Paint With No Openings
Calculator: Paint Calculator  
Inputs: 10 × 10 × 8 ft; no openings; 2 coats; 400 ft²/gal  
Expected result: 320 ft² paintable area; 1.6 gallons; suggest 2  
Reason: Basic wall geometry.

## 43. Save a Favorite
Calculator: Any calculator page  
Inputs: Select “Save calculator,” then reload  
Expected result: Control reads “Saved” after reload; homepage shows the tool under Your saved tools  
Reason: Favorite persistence.

## 44. Remove a Favorite
Calculator: A saved calculator  
Inputs: Select “Saved”  
Expected result: Control returns to “Save calculator”; homepage no longer lists it when no other saved copy exists  
Reason: Favorite removal.

## 45. Recent Tools
Calculator: Two different calculators  
Inputs: Perform valid calculations in both, then return to the homepage  
Expected result: Both appear under Recently used, newest first, without duplicates  
Reason: Local recent-tool ordering.

## 46. Search Synonym — Interest
Calculator: Homepage search  
Inputs: `interest`  
Expected result: Loan Payment and Compound Interest appear  
Reason: Synonym-aware registry search.

## 47. Search Synonym — Sale
Calculator: Homepage search  
Inputs: `sale`  
Expected result: Discount and Sales Tax appear  
Reason: Common phrase matching.

## 48. Calculation History
Calculator: Percentage Change  
Inputs: 80 to 100, calculate, then open `/history/`  
Expected result: Human-readable `80 → 100 = 25% increase` entry  
Reason: Browser-local history summary.

## 49. Disable History
Calculator: History page  
Inputs: Turn off Save recent calculations, then perform a valid calculation  
Expected result: No new history entry is stored  
Reason: Privacy control.

## 50. Clear History
Calculator: History page  
Inputs: Select Clear calculation history and confirm  
Expected result: Entries are removed and the helpful empty state appears  
Reason: User data control.

## 51. Shareable Percentage URL
Calculator: Percentage Change  
Inputs: Open `?start=40&end=50`  
Expected result: Inputs restore to 40 and 50; result automatically shows 25% increase  
Reason: URL-state restoration.

## 52. Invalid URL Value
Calculator: Loan Payment  
Inputs: Open with `?principal=not-a-number&rate=6`  
Expected result: Invalid principal is ignored; page remains functional without script errors  
Reason: Query-parameter safety.

## 53. Copy Result
Calculator: Loan Payment  
Inputs: Calculate, then select Copy result  
Expected result: Copied text includes loan context, monthly payment, and supporting totals  
Reason: Useful out-of-context result.

## 54. Copy Calculation Link
Calculator: Percentage Change  
Inputs: Calculate 80 to 100, then select Copy calculation link  
Expected result: Confirmation reads “Link copied”; copied URL contains allowlisted inputs  
Reason: Shareable calculation.

## 55. Clickable Example
Calculator: Compound Interest  
Inputs: Select `$10,000 at 5% for 10 years`  
Expected result: Contribution becomes zero and result becomes approximately $16,470.09  
Reason: Example shortcut uses the real calculation flow.

## 56. Area Conversion
Calculator: Area Converter  
Inputs: 1 square meter to square feet  
Expected result: Approximately 10.7639 square feet  
Reason: Known area relationship.

## 57. Acre Conversion
Calculator: Area Converter  
Inputs: 1 acre to square feet  
Expected result: 43,560 square feet  
Reason: Exact area relationship.

## 58. Volume Conversion
Calculator: Volume Converter  
Inputs: 1 US gallon to US quarts  
Expected result: 4 US quarts  
Reason: US customary relationship.

## 59. Cup Conversion
Calculator: Volume Converter  
Inputs: 1 US cup to US fluid ounces  
Expected result: 8 US fluid ounces  
Reason: Cooking-volume relationship.

## 60. Speed Conversion
Calculator: Speed Converter  
Inputs: 1 mph to km/h  
Expected result: 1.609344 km/h  
Reason: Exact international conversion.

## 61. Sales Tax — Add
Calculator: Sales Tax  
Inputs: $100, 8.25%, Add tax  
Expected result: $8.25 tax; $108.25 total  
Reason: Standard tax addition.

## 62. Sales Tax — Remove
Calculator: Sales Tax  
Inputs: $108.25, 8.25%, Remove tax  
Expected result: $100 pre-tax price; $8.25 tax  
Reason: Reverse tax calculation.

## 63. Markup and Margin
Calculator: Markup & Margin  
Inputs: $80 cost and $100 selling price  
Expected result: $20 profit; 25% markup; 20% margin  
Reason: Distinguishes calculation bases.

## 64. Clear All Saved Data
Calculator: Privacy page  
Inputs: Select Clear saved calculator data and confirm  
Expected result: Favorites, recent tools, history, and site preferences clear; unrelated storage remains untouched  
Reason: Scoped local-data control.
# Take-Home Pay Estimator — 2026

Expected federal withholding below follows Publication 15-T Worksheet 1A and the annual Percentage Method schedules on page 11. FICA expectations use Publication 15.

1. Single, $75,000 annual, biweekly, no adjustments: federal withholding $295.00/paycheck.
2. Married filing jointly, $120,000 annual, monthly: federal withholding $836.67/paycheck.
3. Head of household, $104,000 annual, weekly ($2,000/paycheck): federal withholding $201.31/paycheck.
4. Single, $75,000 annual, annual pay: federal withholding $7,670.00.
5. Single, $75,000 annual, biweekly, Step 2(c) on: federal withholding $475.65/paycheck.
6. Scenario 1 plus $2,600 Step 3 credits: federal withholding $195.00/paycheck.
7. Scenario 1 plus $10,000 Step 4(a): federal withholding $379.62/paycheck.
8. Scenario 1 plus $10,000 Step 4(b): federal withholding $216.15/paycheck.
9. Scenario 1 plus $50 Step 4(c): federal withholding $345.00/paycheck.
10. $10,000 paycheck with $180,000 YTD wages: Social Security applies to $4,500 only ($279.00); Medicare is $145.00.
11. $10,000 paycheck with $195,000 YTD wages: Additional Medicare applies to $5,000 ($45.00).
12. Exempt federal withholding with positive wages: federal income-tax withholding $0; normal FICA remains.

# Household Budget Calculator

1. $100 weekly = $5,200/year = $433.33/month.
2. $100 every two weeks = $2,600/year = $216.67/month.
3. $100 twice monthly = $2,400/year = $200/month.
4. $100 monthly = $1,200/year.
5. $100 quarterly = $400/year = $33.33/month.
6. $100 every six months = $200/year = $16.67/month.
7. $100 yearly = $8.33/month.
8. $2,500 biweekly income, $2,000 monthly housing, $100 weekly lifestyle, and $500 monthly savings: income $5,416.67, living expenses $2,433.33, savings $500, remaining $2,483.33 per month.
9. $1,000 monthly income and $1,200 monthly expenses: display “Over budget $200/month,” without negative-format errors.
10. Zero income with expenses: category percentages remain finite and display as 0%, with no division error.
11. Add and remove a custom expense: totals change by its normalized monthly equivalent.
12. Switch Monthly to Annual: visible summary amounts multiply by 12 without changing inputs.
13. Enable local saving, reload, and verify rows restore; clear the saved budget and verify `umt:householdBudget` is removed.
14. Copy summary and confirm empty rows are omitted.
