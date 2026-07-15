import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');

  // 1. Create default games
  const gameData = [
    { name: 'Valorant', genre: 'FPS' },
    { name: 'BGMI', genre: 'Battle Royale' },
    { name: 'Free Fire', genre: 'Battle Royale' },
    { name: 'Counter Strike 2', genre: 'FPS' },
    { name: 'EA Sports FC', genre: 'Sports' },
    { name: 'Call of Duty Mobile', genre: 'FPS' },
    { name: 'PUBG PC', genre: 'Battle Royale' },
    { name: 'Clash Royale', genre: 'Strategy' },
  ];

  for (const game of gameData) {
    await prisma.game.upsert({
      where: { name: game.name },
      update: {},
      create: game,
    });
  }

  // 2. Create Admin user
  const adminEmail = 'admin@arenaverse.gg';
  const adminPassword = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      username: 'admin',
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      country: 'Global',
      wallet: {
        create: {
          balance: 100000.00,
        },
      },
    },
  });

  console.log(`Admin user seeded: ${adminUser.email}`);
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
