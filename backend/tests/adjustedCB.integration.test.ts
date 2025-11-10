import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express, { Express } from 'express';
import cors from 'cors';
import { getAdjustedCBHandler } from '../src/adapters/inbound/http/complianceController';

// Create a test app
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/compliance/adjusted-cb', getAdjustedCBHandler);

const prisma = new PrismaClient();

describe('GET /compliance/adjusted-cb Integration Tests', () => {
  beforeEach(async () => {
    // Clean up between tests to ensure isolation
    await prisma.bankEntry.deleteMany({});
    await prisma.shipCompliance.deleteMany({});
    await prisma.route.updateMany({ data: { is_baseline: false } });
  });

  beforeAll(async () => {
    // Clean up and seed test data
    await prisma.bankEntry.deleteMany({});
    await prisma.shipCompliance.deleteMany({});
    await prisma.route.deleteMany({});

    // Create routes with different fuel types for testing
    // Use unique routeCodes to avoid conflicts with other test files
    await prisma.route.createMany({
      data: [
        {
          routeCode: 'ADJ_R001',
          vesselType: 'Container',
          origin: 'Port A',
          destination: 'Port B',
          distance: 12000.0,
          fuelType: 'HFO', // HFO gives negative CB
          fuelConsumptionTonnes: 100.0,
          year: 2024,
          ghgIntensity: 90.67,
          totalEmissions: 4500.0,
          is_baseline: false,
        },
        {
          routeCode: 'ADJ_R002',
          vesselType: 'BulkCarrier',
          origin: 'Port C',
          destination: 'Port D',
          distance: 11500.0,
          fuelType: 'LNG', // LNG gives positive CB
          fuelConsumptionTonnes: 100.0,
          year: 2024,
          ghgIntensity: 75.365,
          totalEmissions: 4200.0,
          is_baseline: false,
        },
        {
          routeCode: 'ADJ_R003',
          vesselType: 'Tanker',
          origin: 'Port E',
          destination: 'Port F',
          distance: 12500.0,
          fuelType: 'MGO', // MGO gives positive CB
          fuelConsumptionTonnes: 100.0,
          year: 2024,
          ghgIntensity: 85.37,
          totalEmissions: 4700.0,
          is_baseline: false,
        },
        {
          routeCode: 'ADJ_R004',
          vesselType: 'RoRo',
          origin: 'Port G',
          destination: 'Port H',
          distance: 11800.0,
          fuelType: 'HFO',
          fuelConsumptionTonnes: 100.0,
          year: 2025, // Different year
          ghgIntensity: 90.67,
          totalEmissions: 4300.0,
          is_baseline: false,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.bankEntry.deleteMany({});
    await prisma.route.deleteMany({});
    await prisma.$disconnect();
  });

  describe('GET /compliance/adjusted-cb', () => {
    it('should return adjusted CB for all routes in the given year', async () => {
      const response = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 2024 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(3); // R001, R002, R003 for year 2024

      // Verify structure
      response.body.forEach((item: any) => {
        expect(item).toHaveProperty('shipId');
        expect(item).toHaveProperty('shipName');
        expect(item).toHaveProperty('year', 2024);
        expect(item).toHaveProperty('cb_before');
        expect(item).toHaveProperty('cb_adjusted');
        expect(typeof item.cb_before).toBe('number');
        expect(typeof item.cb_adjusted).toBe('number');
      });
    });

    it('should return empty array if no routes exist for the year', async () => {
      const response = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 2030 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should return 400 if year is missing', async () => {
      const response = await request(app)
        .get('/compliance/adjusted-cb');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'MISSING_PARAMS');
    });

    it('should return 400 if year is not a valid integer', async () => {
      const response = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'INVALID_YEAR');
    });

    it('should calculate adjusted CB correctly with applied bank entries', async () => {
      // Clean up any existing bank entries first
      await prisma.bankEntry.deleteMany({});
      
      // First, create some applied bank entries
      const route1 = await prisma.route.findUnique({ where: { routeCode: 'ADJ_R001' } });
      const route2 = await prisma.route.findUnique({ where: { routeCode: 'ADJ_R002' } });

      if (route1 && route2) {
        // Create applied bank entry for R001 (1 tonne = 1,000,000 gCO2e)
        await prisma.bankEntry.create({
          data: {
            routeCode: 'ADJ_R001',
            routeId: route1.id,
            year: 2024,
            amount: 0.5, // 0.5 tonnes = 500,000 gCO2e
            type: 'APPLIED',
            applied: true,
          },
        });

        // Create another applied bank entry for R001
        await prisma.bankEntry.create({
          data: {
            routeCode: 'ADJ_R001',
            routeId: route1.id,
            year: 2024,
            amount: 0.3, // 0.3 tonnes = 300,000 gCO2e
            type: 'APPLIED',
            applied: true,
          },
        });

        // Total applied for R001: 0.8 tonnes = 800,000 gCO2e

        const response = await request(app)
          .get('/compliance/adjusted-cb')
          .query({ year: 2024 });

        expect(response.status).toBe(200);
        
        const r001Result = response.body.find((item: any) => item.shipId === 'ADJ_R001');
        expect(r001Result).toBeDefined();
        
        // Verify adjusted CB = raw CB + applied bank entries
        // Raw CB for HFO (100 tonnes) is approximately -5,468,000 gCO2e
        // Applied: 800,000 gCO2e
        // Adjusted: -5,468,000 + 800,000 = -4,668,000 gCO2e
        expect(r001Result.cb_adjusted).toBe(r001Result.cb_before + 800000);
      }
    });

    it('should return adjusted CB equal to raw CB when no bank entries are applied', async () => {
      const response = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 2025 });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1); // Only ADJ_R004 for year 2025

      const r004Result = response.body[0];
      expect(r004Result.shipId).toBe('ADJ_R004');
      
      // When no bank entries are applied, adjusted CB should equal raw CB
      expect(r004Result.cb_adjusted).toBe(r004Result.cb_before);
    });

    it('should filter by year correctly', async () => {
      const response2024 = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 2024 });

      const response2025 = await request(app)
        .get('/compliance/adjusted-cb')
        .query({ year: 2025 });

      expect(response2024.status).toBe(200);
      expect(response2025.status).toBe(200);

      // 2024 should have 3 routes (ADJ_R001, ADJ_R002, ADJ_R003)
      expect(response2024.body.length).toBe(3);
      
      // 2025 should have 1 route (ADJ_R004)
      expect(response2025.body.length).toBe(1);
      expect(response2025.body[0].shipId).toBe('ADJ_R004');
    });
  });
});

