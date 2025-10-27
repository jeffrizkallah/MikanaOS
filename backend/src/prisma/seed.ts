import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../lib/auth.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create branches
  const centralKitchen = await prisma.branch.upsert({
    where: { code: 'CK001' },
    update: {},
    create: {
      name: 'Central Kitchen',
      code: 'CK001',
      location: '789 Industrial Blvd, City',
      type: 'CENTRAL_KITCHEN',
      employees: 25,
    },
  });

  const branches = [];
  for (let i = 1; i <= 12; i++) {
    const branch = await prisma.branch.upsert({
      where: { code: `BR${String(i).padStart(3, '0')}` },
      update: {},
      create: {
        name: `Branch ${String.fromCharCode(64 + i)}`,
        code: `BR${String(i).padStart(3, '0')}`,
        location: `${100 + i * 50} Main St, District ${i}`,
        type: 'BRANCH',
        employees: 8 + Math.floor(Math.random() * 5),
      },
    });
    branches.push(branch);
  }

  console.log('✅ Created branches');

  // Create users
  const adminPassword = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@mikanaos.com' },
    update: {},
    create: {
      email: 'admin@mikanaos.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const headOfficePassword = await hashPassword('office123');
  const headOffice = await prisma.user.upsert({
    where: { email: 'office@mikanaos.com' },
    update: {},
    create: {
      email: 'office@mikanaos.com',
      name: 'Head Office Manager',
      password: headOfficePassword,
      role: 'HEAD_OFFICE',
    },
  });

  const managerPassword = await hashPassword('manager123');
  const manager1 = await prisma.user.upsert({
    where: { email: 'manager1@mikanaos.com' },
    update: {},
    create: {
      email: 'manager1@mikanaos.com',
      name: 'Sarah Johnson',
      password: managerPassword,
      role: 'BRANCH_MANAGER',
    },
  });

  const manager2 = await prisma.user.upsert({
    where: { email: 'manager2@mikanaos.com' },
    update: {},
    create: {
      email: 'manager2@mikanaos.com',
      name: 'Mike Chen',
      password: managerPassword,
      role: 'BRANCH_MANAGER',
    },
  });

  console.log('✅ Created users');

  // Assign branches to managers
  await prisma.userBranch.createMany({
    data: [
      { userId: manager1.id, branchId: branches[0].id },
      { userId: manager1.id, branchId: branches[1].id },
      { userId: manager1.id, branchId: branches[2].id },
      { userId: manager2.id, branchId: branches[3].id },
      { userId: manager2.id, branchId: branches[4].id },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Assigned branches to managers');

  // Create suppliers
  const suppliers = await Promise.all([
    prisma.supplier.upsert({
      where: { id: 'supplier-1' },
      update: {},
      create: {
        id: 'supplier-1',
        name: 'Fresh Farms Co.',
        category: 'Produce',
        contactName: 'John Farmer',
        email: 'john@freshfarms.com',
        phone: '+1-234-567-8901',
        status: 'ACTIVE',
        rating: 4.8,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-2' },
      update: {},
      create: {
        id: 'supplier-2',
        name: 'Ocean Catch Seafood',
        category: 'Seafood',
        contactName: 'Mary Fisher',
        email: 'mary@oceancatch.com',
        phone: '+1-234-567-8902',
        status: 'ACTIVE',
        rating: 4.6,
      },
    }),
    prisma.supplier.upsert({
      where: { id: 'supplier-3' },
      update: {},
      create: {
        id: 'supplier-3',
        name: 'Premium Meats Ltd',
        category: 'Meat',
        contactName: 'Bob Butcher',
        email: 'bob@premiummeats.com',
        phone: '+1-234-567-8903',
        status: 'ACTIVE',
        rating: 4.9,
      },
    }),
  ]);

  console.log('✅ Created suppliers');

  // Create inventory items for each branch
  const inventoryItems = [
    { name: 'Chicken Breast', unit: 'kg', baseQty: 450 },
    { name: 'Tomatoes', unit: 'kg', baseQty: 120 },
    { name: 'Olive Oil', unit: 'L', baseQty: 25 },
    { name: 'Pasta', unit: 'kg', baseQty: 200 },
    { name: 'Salmon', unit: 'kg', baseQty: 80 },
    { name: 'Rice', unit: 'kg', baseQty: 300 },
    { name: 'Onions', unit: 'kg', baseQty: 150 },
    { name: 'Bell Peppers', unit: 'kg', baseQty: 90 },
  ];

  for (const branch of [...branches, centralKitchen]) {
    for (const item of inventoryItems) {
      const variance = Math.random() * 0.4 + 0.8; // 80% to 120%
      const quantity = Math.floor(item.baseQty * variance);

      let status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' = 'IN_STOCK';
      if (quantity < item.baseQty * 0.3) status = 'LOW_STOCK';
      if (quantity === 0) status = 'OUT_OF_STOCK';

      await prisma.inventory.create({
        data: {
          itemName: item.name,
          quantity,
          unit: item.unit,
          location: branch.type === 'CENTRAL_KITCHEN' ? 'Cold Storage' : 'Main Storage',
          branchId: branch.id,
          status,
          minStock: item.baseQty * 0.3,
          maxStock: item.baseQty * 1.5,
        },
      });
    }
  }

  console.log('✅ Created inventory items');

  // Create sample sales data (last 30 days)
  const categories = ['Appetizers', 'Main Courses', 'Desserts', 'Beverages'];
  for (let day = 0; day < 30; day++) {
    const date = new Date();
    date.setDate(date.getDate() - day);

    for (const branch of branches) {
      const numSales = Math.floor(Math.random() * 10) + 5;

      for (let i = 0; i < numSales; i++) {
        await prisma.sale.create({
          data: {
            branchId: branch.id,
            saleDate: date,
            amount: Math.floor(Math.random() * 500) + 100,
            items: Math.floor(Math.random() * 20) + 5,
            category: categories[Math.floor(Math.random() * categories.length)],
          },
        });
      }
    }
  }

  console.log('✅ Created sales data');

  // Create sample recipes
  await prisma.recipe.create({
    data: {
      name: 'Grilled Chicken Sandwich',
      category: 'Main Courses',
      servings: 4,
      prepTime: 15,
      cookTime: 20,
      ingredients: {
        create: [
          { itemName: 'Chicken Breast', quantity: 400, unit: 'g' },
          { itemName: 'Tomatoes', quantity: 2, unit: 'pcs' },
          { itemName: 'Olive Oil', quantity: 0.05, unit: 'L' },
        ],
      },
    },
  });

  console.log('✅ Created recipes');

  // Create sample orders
  const thursday = new Date();
  thursday.setDate(thursday.getDate() + ((4 - thursday.getDay() + 7) % 7));

  for (let i = 0; i < 5; i++) {
    await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        branchId: branches[i].id,
        userId: manager1.id,
        dispatchDate: thursday,
        totalAmount: Math.floor(Math.random() * 5000) + 2000,
        status: 'PENDING',
        items: {
          create: [
            {
              itemName: 'Chicken Breast',
              quantity: 50,
              unit: 'kg',
              price: 8.5,
              total: 425,
            },
            {
              itemName: 'Tomatoes',
              quantity: 20,
              unit: 'kg',
              price: 3.2,
              total: 64,
            },
          ],
        },
      },
    });
  }

  console.log('✅ Created sample orders');

  // Create AI insights
  await prisma.aIInsight.createMany({
    data: [
      {
        type: 'RECOMMENDATION',
        title: 'Optimize Inventory Levels',
        description:
          'Based on sales patterns, consider reducing chicken breast stock by 15% to minimize waste.',
        impact: 'HIGH',
        confidence: 94,
      },
      {
        type: 'PREDICTION',
        title: 'Increased Demand Expected',
        description:
          'Sales forecasts suggest a 22% increase in demand next week. Consider increasing Thursday order.',
        impact: 'MEDIUM',
        confidence: 87,
      },
      {
        type: 'ALERT',
        title: 'Potential Stockout Warning',
        description:
          'Olive oil inventory may run out by Friday based on current consumption rates.',
        impact: 'HIGH',
        confidence: 91,
      },
    ],
  });

  console.log('✅ Created AI insights');

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📝 Default credentials:');
  console.log('Admin: admin@mikanaos.com / admin123');
  console.log('Head Office: office@mikanaos.com / office123');
  console.log('Manager: manager1@mikanaos.com / manager123');
  console.log('Manager: manager2@mikanaos.com / manager123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
