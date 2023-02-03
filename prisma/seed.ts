import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: [
      {
        name: "Göran Svensson",
        email: "goran@svensson.se",
      },
      {
        name: "Gunilla Svensson",
        email: "gunilla@svensson.se",
      },
    ],
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
