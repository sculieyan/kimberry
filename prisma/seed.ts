import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

const testData = [
  { number: 1, name: "预设数据 1" },
  { number: 2, name: "预设数据 2" },
  { number: 3, name: "预设数据 3" },
  { number: 4, name: "预设数据 4" },
  { number: 5, name: "预设数据 5" },
];

async function main() {
  const result = await prisma.test.createMany({
    data: testData,
    skipDuplicates: true,
  });

  console.log(`种子数据写入完成，新增 ${result.count} 条。`);
}

main()
  .catch((error) => {
    console.error("种子数据写入失败：", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
