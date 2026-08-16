import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 一组示例订单元数据（对应 checkout 时写入 Stripe session metadata 的字段）
const orderMetadataData = {
  // 订单号（唯一业务标识）
  orderNumber: "KB-SEED-00001",

  // Stripe Checkout Session ID（示例为 test 模式格式）
  stripeSessionId: "cs_test_seed0000000000000000000000000000000000000000000000000001",

  // 客户信息
  customerEmail: "jane.doe@example.com",
  firstName: "Jane",
  lastName: "Doe",
  address: "12 Queen Street",
  city: "Auckland",
  region: "Auckland",
  postcode: "1010",
  phone: "+64 21 123 4567",

  // 物流信息
  shippingCode: "COURIER",
  shippingName: "Courier (1-3 working days)",
  shippingPrice: 6.5,

  // 商品信息（每单一款商品）
  productName: "Classic — Milk Oat Flakes",
  productDetail: "400g · 10 sachets",
  productQty: 2,
  productUnitPrice: 19.9,
};

async function main() {
  // 幂等：已有数据则跳过，不改动也不新增
  const existing = await prisma.orderMetadata.findFirst();
  if (existing) {
    console.log(`order_metadata 已有数据（id=${existing.id}），跳过种子写入。`);
    return;
  }

  const record = await prisma.orderMetadata.create({
    data: orderMetadataData,
  });

  console.log(`种子数据写入完成，order_metadata 新增记录 id=${record.id}。`);
}

main()
  .catch((error) => {
    console.error("种子数据写入失败：", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
