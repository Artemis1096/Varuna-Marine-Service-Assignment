import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import express, { Express } from 'express';
import cors from 'cors';
import { getRoutesHandler } from '../src/adapters/inbound/http/routesController';

// Create a test app
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/routes', getRoutesHandler);

const prisma = new PrismaClient();

describe('GET /routes - Filter Integration Tests', () => {
  beforeEach(async () => {
    // Clean up between tests to ensure isolation
    await prisma.bankEntry.deleteMany({});
    await prisma.shipCompliance.deleteMany({});
    // Delete all routes and recreate only this test's routes
    await prisma.route.deleteMany({});

    // Use unique routeCodes to avoid conflicts with other test files
    await prisma.route.createMany({
      data: [
        {
          routeCode: 'ROUTE_R001',
          vesselType: 'Container',
          origin: 'Port A',
          destination: 'Port B',
          distance: 12000.0,
          fuelType: 'HFO',
          fuelConsumptionTonnes: 5000.0,
          year: 2024,
          ghgIntensity: 91.0,
          totalEmissions: 4500.0,
          is_baseline: true,
        },
        {
          routeCode: 'ROUTE_R002',
          vesselType: 'Container',
          origin: 'Port C',
          destination: 'Port D',
          distance: 11500.0,
          fuelType: 'LNG',
          fuelConsumptionTonnes: 4800.0,
          year: 2025,
          ghgIntensity: 88.0,
          totalEmissions: 4200.0,
          is_baseline: false,
        },
        {
          routeCode: 'ROUTE_R003',
          vesselType: 'BulkCarrier',
          origin: 'Port E',
          destination: 'Port F',
          distance: 12500.0,
          fuelType: 'MGO',
          fuelConsumptionTonnes: 5100.0,
          year: 2024,
          ghgIntensity: 93.5,
          totalEmissions: 4700.0,
          is_baseline: false,
        },
        {
          routeCode: 'ROUTE_R004',
          vesselType: 'Container',
          origin: 'Port G',
          destination: 'Port H',
          distance: 11800.0,
          fuelType: 'HFO',
          fuelConsumptionTonnes: 4900.0,
          year: 2025,
          ghgIntensity: 89.2,
          totalEmissions: 4300.0,
          is_baseline: false,
        },
        {
          routeCode: 'ROUTE_R005',
          vesselType: 'Tanker',
          origin: 'Port I',
          destination: 'Port J',
          distance: 11900.0,
          fuelType: 'LNG',
          fuelConsumptionTonnes: 4950.0,
          year: 2025,
          ghgIntensity: 90.5,
          totalEmissions: 4400.0,
          is_baseline: false,
        },
      ],
    });
  });

  afterAll(async () => {
    await prisma.route.deleteMany({});
    await prisma.$disconnect();
  });

  describe('Filter by vesselType and year', () => {
    it('GET /routes?vesselType=Container&year=2025 should return only matching rows', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ vesselType: 'Container', year: 2025 });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Should return R002 and R004 (Container vessels from 2025)
      expect(response.body.length).toBe(2);
      
      const routeCodes = response.body.map((r: any) => r.routeCode);
      expect(routeCodes).toContain('ROUTE_R002');
      expect(routeCodes).toContain('ROUTE_R004');
      
      // Verify all returned routes match the filter
      response.body.forEach((route: any) => {
        expect(route.vesselType).toBe('Container');
        expect(route.year).toBe(2025);
      });
    });
  });

  describe('Filter by fuelType', () => {
    it('GET /routes?fuelType=HFO should return only HFO routes', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ fuelType: 'HFO' });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      
      // Should return R001 and R004 (HFO routes)
      expect(response.body.length).toBe(2);
      
      response.body.forEach((route: any) => {
        expect(route.fuelType?.toUpperCase()).toBe('HFO');
      });
    });

    it('GET /routes?fuelType=lng should be case-insensitive', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ fuelType: 'lng' });

      expect(response.status).toBe(200);
      
      // Should return R002 and R005 (LNG routes)
      expect(response.body.length).toBe(2);
      
      response.body.forEach((route: any) => {
        expect(route.fuelType?.toUpperCase()).toBe('LNG');
      });
    });
  });

  describe('Filter by year', () => {
    it('GET /routes?year=2024 should return only 2024 routes', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ year: 2024 });

      expect(response.status).toBe(200);
      
      // Should return R001 and R003 (2024 routes)
      expect(response.body.length).toBe(2);
      
      response.body.forEach((route: any) => {
        expect(route.year).toBe(2024);
      });
    });
  });

  describe('Combined filters', () => {
    it('GET /routes?vesselType=Container&fuelType=HFO&year=2025 should return R004', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ vesselType: 'Container', fuelType: 'HFO', year: 2025 });

      expect(response.status).toBe(200);
      
      // Should return only R004
      expect(response.body.length).toBe(1);
      expect(response.body[0].routeCode).toBe('ROUTE_R004');
      expect(response.body[0].vesselType).toBe('Container');
      expect(response.body[0].fuelType).toBe('HFO');
      expect(response.body[0].year).toBe(2025);
    });
  });

  describe('No filters', () => {
    it('GET /routes should return all routes', async () => {
      const response = await request(app)
        .get('/routes');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(5);
    });
  });

  describe('Validation', () => {
    it('GET /routes?year=invalid should return 400', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ year: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('year must be a valid integer');
    });

    it('GET /routes?year=2024.5 should return 400 (not an integer)', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ year: '2024.5' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('year must be a valid integer');
    });

    it('GET /routes?year= should return all routes (empty string ignored)', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ year: '' });

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
    });
  });

  describe('Case-insensitive filters', () => {
    it('GET /routes?vesselType=container should match Container (case-insensitive)', async () => {
      const response = await request(app)
        .get('/routes')
        .query({ vesselType: 'container' });

      expect(response.status).toBe(200);
      
      // Should return R001, R002, R004 (all Container vessels)
      expect(response.body.length).toBe(3);
      
      response.body.forEach((route: any) => {
        expect(route.vesselType).toBe('Container');
      });
    });
  });
});

