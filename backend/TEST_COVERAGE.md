# Test Coverage Analysis

## Testing Checklist Status

### ✅ Unit Tests

1. **ComputeComparison** (`getRoutesComparison.test.ts`)
   - ✅ Tests percentDiff calculation: `baseline=90, comparison=88 → percentDiff ~ -2.22%`
   - ✅ Tests compliant flag: `comparison <= FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ`
   - ✅ Tests with different fuel types and intensities

2. **ComputeCB** (`computeCB.test.ts`)
   - ✅ Tests target intensity constant: `FUELEU_TARGET_INTENSITY_GCO2E_PER_MJ = 89.3368`
   - ✅ Tests CB calculation for HFO, MGO, LNG
   - ✅ Tests positive and negative CB values

3. **BankSurplus** ❌ **MISSING UNIT TEST**
   - ⚠️ Only integration tests exist (`banking.integration.test.ts`)
   - Should have unit tests for:
     - Validating CB is positive
     - Validating amount > 0
     - Validating amount ≤ available CB
     - Computing cb_after = cb_before - applied

4. **ApplyBanked** ❌ **MISSING UNIT TEST**
   - ⚠️ Only integration tests exist (`banking.integration.test.ts`)
   - Should have unit tests for:
     - Validating banked surplus exists
     - Validating amount > 0
     - Validating amount ≤ available banked surplus
     - Computing cb_after = cb_before + applied (toward zero)

5. **CreatePool** (`createPool.test.ts`)
   - ✅ Tests pool sum validation (negative, zero, positive)
   - ✅ Tests greedy allocation (exact match, partial cover, rounding)
   - ✅ Tests validation rules (no deficit ship worse, no surplus ship negative)
   - ✅ Tests complex scenarios (multiple surpluses/deficits, zero CB)

### ✅ Integration Tests

1. **HTTP Endpoints via Supertest**
   - ✅ `routes.integration.test.ts` - Tests GET /routes with filters (vesselType, fuelType, year)
   - ✅ `banking.integration.test.ts` - Tests:
     - GET /compliance/cb
     - POST /banking/bank
     - POST /banking/apply
   - ✅ `adjustedCB.integration.test.ts` - Tests GET /compliance/adjusted-cb
   - ✅ `routes.integration.test.ts` - Tests GET /routes/comparison (via getRoutesComparison)

### ❌ Data Tests

1. **Migrations + Seeds Load Correctly** ❌ **MISSING**
   - No explicit test to verify:
     - Prisma migrations run successfully
     - Seed data loads correctly
     - Database schema matches Prisma schema

### ✅ Edge Cases

1. **Negative CB** ✅
   - Tested in `banking.integration.test.ts`:
     - `should return 400 with code CB_NOT_POSITIVE if CB is negative or zero`
     - Tests with HFO (which gives negative CB)

2. **Over-apply Bank** ✅
   - Tested in `banking.integration.test.ts`:
     - `should return 400 with code AMOUNT_EXCEEDS_AVAILABLE if amount exceeds banked amount`
     - Tests applying more than available banked surplus

3. **Invalid Pool** ✅
   - Tested in `createPool.test.ts`:
     - `should reject pool with negative sum`
     - Tests pool sum validation

## Summary

### ✅ Covered
- ComputeComparison (unit)
- ComputeCB (unit)
- CreatePool (unit)
- All HTTP endpoints (integration)
- Negative CB (edge case)
- Over-apply bank (edge case)
- Invalid pool (edge case)

### ❌ Missing
1. **Unit tests for BankSurplus service**
2. **Unit tests for ApplyBanked service**
3. **Data tests for migrations and seeds**

## Recommendations

1. Create `bankSurplus.test.ts` - Unit tests for BankSurplus service
2. Create `applyBanked.test.ts` - Unit tests for ApplyBanked service
3. Create `data.test.ts` or `migrations.test.ts` - Tests to verify:
   - Prisma migrations can run
   - Seed script loads data correctly
   - Database schema is valid

