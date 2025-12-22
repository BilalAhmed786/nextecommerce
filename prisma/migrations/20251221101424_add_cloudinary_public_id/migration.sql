-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imagePublicId" TEXT;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "publicId" TEXT;
