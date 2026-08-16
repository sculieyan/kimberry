-- CreateTable
CREATE TABLE "order_metadata" (
    "id" SERIAL NOT NULL,
    "orderNumber" VARCHAR(32) NOT NULL,
    "stripeSessionId" VARCHAR(255),
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

-- CreateIndex
CREATE UNIQUE INDEX "order_metadata_orderNumber_key" ON "order_metadata"("orderNumber");
