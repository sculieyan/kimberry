/*
  Warnings:

  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "test";

-- CreateTable
CREATE TABLE "order_metadata" (
    "id" SERIAL NOT NULL,
    "customerEmail" VARCHAR(255),
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "region" VARCHAR(100),
    "postcode" VARCHAR(20),
    "phone" VARCHAR(50),
    "shippingCode" VARCHAR(50),
    "shippingName" VARCHAR(255),
    "shippingPrice" DECIMAL(10,2),
    "productName" VARCHAR(255),
    "productDetail" TEXT,
    "productQty" SMALLINT,
    "productUnitPrice" DECIMAL(10,2),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "order_metadata_pkey" PRIMARY KEY ("id")
);
