-- CreateTable
CREATE TABLE "test" (
    "number" INTEGER NOT NULL,
    "name" VARCHAR,
    "createtime" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_pkey" PRIMARY KEY ("number")
);
