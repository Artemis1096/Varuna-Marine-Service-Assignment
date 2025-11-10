import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing routes (optional - for clean seed)
  await prisma.route.deleteMany({});

  // Create 5 routes with provided data
  const routes = [
    {
      routeCode: 'R001',
      vesselType: 'Container',
      origin: 'Port A',
      destination: 'Port B',
      distance: 12000.0, // km
      fuelType: 'HFO',
      fuelConsumptionTonnes: 5000.0,
      year: 2024,
      ghgIntensity: 91.0,
      totalEmissions: 4500.0, // tonnes
      is_baseline: true, // Mark R001 as baseline
    },
    {
      routeCode: 'R002',
      vesselType: 'BulkCarrier',
      origin: 'Port C',
      destination: 'Port D',
      distance: 11500.0, // km
      fuelType: 'LNG',
      fuelConsumptionTonnes: 4800.0,
      year: 2024,
      ghgIntensity: 88.0,
      totalEmissions: 4200.0, // tonnes
      is_baseline: false,
    },
    {
      routeCode: 'R003',
      vesselType: 'Tanker',
      origin: 'Port E',
      destination: 'Port F',
      distance: 12500.0, // km
      fuelType: 'MGO',
      fuelConsumptionTonnes: 5100.0,
      year: 2024,
      ghgIntensity: 93.5,
      totalEmissions: 4700.0, // tonnes
      is_baseline: false,
    },
    {
      routeCode: 'R004',
      vesselType: 'RoRo',
      origin: 'Port G',
      destination: 'Port H',
      distance: 11800.0, // km
      fuelType: 'HFO',
      fuelConsumptionTonnes: 4900.0,
      year: 2025,
      ghgIntensity: 89.2,
      totalEmissions: 4300.0, // tonnes
      is_baseline: false,
    },
    {
      routeCode: 'R005',
      vesselType: 'Container',
      origin: 'Port I',
      destination: 'Port J',
      distance: 11900.0, // km
      fuelType: 'LNG',
      fuelConsumptionTonnes: 4950.0,
      year: 2025,
      ghgIntensity: 90.5,
      totalEmissions: 4400.0, // tonnes
      is_baseline: false,
    },
  ];

  for (const route of routes) {
    const created = await prisma.route.create({
      data: route,
    });
    console.log(`Created route: ${created.vesselType} (${created.origin} → ${created.destination})`);
  }

  console.log('Seed completed successfully!');
  console.log(`Total routes created: ${routes.length}`);
  console.log(`Baseline route: R001 with is_baseline: ${routes[0].is_baseline}`);
}

main()
  .catch((e) => {
    console.error('Error during seed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

