# Test Case: Banked Surplus Available

## Overview
This test case demonstrates how to create a scenario where banked surplus is available for applying.

## Step-by-Step Test Case

### Step 1: Bank Surplus from a Route with Positive CB

**Route Selection:**
- Use **R002** (BulkCarrier, LNG, 2024) or **R005** (Container, LNG, 2025)
- These routes use LNG fuel which has intensity ~75.365 gCO₂e/MJ
- Since 75.365 < 89.3368 (target), the CB will be **positive** (surplus)

**API Call:**
```http
GET /compliance/cb?shipId=R002&year=2024
```

**Expected Response:**
```json
{
  "shipId": "R002",
  "year": 2024,
  "cb_before": 573680000,  // Positive value in gCO₂e
  "unit": "gCO₂e",
  "details": {
    "actualIntensity": 75.365,
    "cb_tonnesCO2e": 573.68
  }
}
```

**Bank Surplus:**
```http
POST /banking/bank
Content-Type: application/json

{
  "shipId": "R002",
  "year": 2024,
  "amount_gco2eq": 286840000  // Bank 50% of available CB (in gCO₂e)
}
```

**Expected Response:**
```json
{
  "cb_before": 573680000,
  "applied": 286840000,
  "cb_after": 286840000
}
```

### Step 2: Apply Banked Surplus to a Route with Negative CB

**Route Selection:**
- Use **R001** (Container, HFO, 2024) or **R004** (RoRo, HFO, 2025)
- These routes use HFO fuel which has intensity ~90.67 gCO₂e/MJ
- Since 90.67 > 89.3368 (target), the CB will be **negative** (deficit)

**API Call:**
```http
GET /compliance/cb?shipId=R001&year=2024
```

**Expected Response:**
```json
{
  "shipId": "R001",
  "year": 2024,
  "cb_before": -54680000,  // Negative value in gCO₂e (deficit)
  "unit": "gCO₂e",
  "details": {
    "actualIntensity": 90.67,
    "cb_tonnesCO2e": -54.68
  }
}
```

**Apply Banked Surplus:**
```http
POST /banking/apply
Content-Type: application/json

{
  "shipId": "R001",
  "year": 2024,
  "amount_gco2eq": 286840000  // Apply the banked amount (in gCO₂e)
}
```

**Expected Response:**
```json
{
  "cb_before": -54680000,
  "applied": 286840000,
  "cb_after": 232160000  // cb_before + applied = -54680000 + 286840000
}
```

## Complete Test Case Flow

### Scenario: Bank from R002, Apply to R001

1. **Check CB for R002 (LNG - positive CB)**
   ```
   GET /compliance/cb?shipId=R002&year=2024
   → cb_before: ~573,680,000 gCO₂e (positive)
   ```

2. **Bank surplus from R002**
   ```
   POST /banking/bank
   Body: { "shipId": "R002", "year": 2024, "amount_gco2eq": 286840000 }
   → Success: Banked 286,840,000 gCO₂e
   ```

3. **Check CB for R001 (HFO - negative CB)**
   ```
   GET /compliance/cb?shipId=R001&year=2024
   → cb_before: ~-54,680,000 gCO₂e (negative/deficit)
   ```

4. **Apply banked surplus to R001**
   ```
   POST /banking/apply
   Body: { "shipId": "R001", "year": 2024, "amount_gco2eq": 286840000 }
   → Success: Applied 286,840,000 gCO₂e
   → cb_after: 232,160,000 gCO₂e (deficit reduced)
   ```

## Important Notes

1. **Banked amounts are per routeCode/shipId**: In the current implementation, banked surplus is stored per routeCode. You can only apply banked surplus to the same shipId that banked it.

2. **Positive CB routes** (can bank):
   - R002: LNG fuel → positive CB
   - R003: MGO fuel → positive CB  
   - R005: LNG fuel → positive CB

3. **Negative CB routes** (can apply):
   - R001: HFO fuel → negative CB
   - R004: HFO fuel → negative CB

4. **Amount validation**:
   - Bank: amount must be > 0 and ≤ available positive CB
   - Apply: amount must be > 0 and ≤ available banked surplus

## Example Using cURL

```bash
# Step 1: Get CB for R002 (positive)
curl "http://localhost:3000/compliance/cb?shipId=R002&year=2024"

# Step 2: Bank surplus from R002
curl -X POST "http://localhost:3000/banking/bank" \
  -H "Content-Type: application/json" \
  -d '{"shipId":"R002","year":2024,"amount_gco2eq":286840000}'

# Step 3: Get CB for R001 (negative)
curl "http://localhost:3000/compliance/cb?shipId=R001&year=2024"

# Step 4: Apply banked surplus to R001
curl -X POST "http://localhost:3000/banking/apply" \
  -H "Content-Type: application/json" \
  -d '{"shipId":"R001","year":2024,"amount_gco2eq":286840000}'
```

## Expected Results

✅ **Banking succeeds** when:
- Route has positive CB (cb_before > 0)
- Amount is > 0 and ≤ cb_before

✅ **Applying succeeds** when:
- Banked surplus is available for the shipId/year
- Amount is > 0 and ≤ available banked surplus

❌ **Banking fails** when:
- Route has negative or zero CB (cb_before ≤ 0) → Error: `CB_NOT_POSITIVE`
- Amount is ≤ 0 → Error: `INVALID_AMOUNT`
- Amount exceeds available CB → Error: `AMOUNT_EXCEEDS_AVAILABLE`

❌ **Applying fails** when:
- No banked surplus available → Error: `NO_BANKED_SURPLUS`
- Amount is ≤ 0 → Error: `INVALID_AMOUNT`
- Amount exceeds available banked surplus → Error: `AMOUNT_EXCEEDS_AVAILABLE`

