import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Clear existing routes (optional - for clean seed)
  await prisma.route.deleteMany({});

  // Create 5 routes
  const routes = [
    {
      routeCode: 'R001',
      name: 'R001',
      origin: 'Rotterdam',
      destination: 'Singapore',
      distance: 8500.0,
      fuelType: 'HFO',
      fuelConsumptionTonnes: 2500.0,
      year: 2025,
      is_baseline: true, // Mark R001 as baseline
    },
    {
      routeCode: 'R002',
      name: 'R002',
      origin: 'Hamburg',
      destination: 'Shanghai',
      distance: 12000.0,
      fuelType: 'MGO',
      fuelConsumptionTonnes: 3200.0,
      year: 2025,
      is_baseline: false,
    },
    {
      routeCode: 'R003',
      name: 'R003',
      origin: 'Los Angeles',
      destination: 'Tokyo',
      distance: 5500.0,
      fuelType: 'LNG',
      fuelConsumptionTonnes: 1800.0,
      year: 2025,
      is_baseline: false,
    },
    {
      routeCode: 'R004',
      name: 'R004',
      origin: 'New York',
      destination: 'London',
      distance: 3200.0,
      fuelType: 'HFO',
      fuelConsumptionTonnes: 950.0,
      year: 2025,
      is_baseline: false,
    },
    {
      routeCode: 'R005',
      name: 'R005',
      origin: 'Dubai',
      destination: 'Mumbai',
      distance: 1200.0,
      fuelType: 'MGO',
      fuelConsumptionTonnes: 350.0,
      year: 2025,
      is_baseline: false,
    },
  ];

  for (const route of routes) {
    const created = await prisma.route.create({
      data: route,
    });
    console.log(`Created route: ${created.name} (${created.origin} → ${created.destination})`);
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

