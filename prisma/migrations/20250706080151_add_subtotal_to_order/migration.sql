/*
  Warnings:

  - The values [Stripe,Cashondelivery] on the enum `Paymentmode` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Paymentmode_new" AS ENUM ('STRIPE', 'COD');
ALTER TABLE "Order" ALTER COLUMN "payment" TYPE "Paymentmode_new" USING ("payment"::text::"Paymentmode_new");
ALTER TYPE "Paymentmode" RENAME TO "Paymentmode_old";
ALTER TYPE "Paymentmode_new" RENAME TO "Paymentmode";
DROP TYPE "Paymentmode_old";
COMMIT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL;
