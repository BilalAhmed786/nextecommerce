/*
  Warnings:

  - Added the required column `payment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingCost` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Paymentmode" AS ENUM ('Stripe', 'Cashondelivery');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "payment" "Paymentmode" NOT NULL,
ADD COLUMN     "shippingCost" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingRate_city_key" ON "ShippingRate"("city");
