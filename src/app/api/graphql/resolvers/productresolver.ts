import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import fs from "fs";
import path from "path";
import { MyContext } from "../route";
import { deleteFromCloudinary } from "@/utils/deletecloudnaryimage";
const uploadDir = path.join(process.cwd(), "public", "uploads");

export const productresolvers = {
  Query: {
    products: async (
      _: any,
      args: {
        skip?: number;
        take?: number;
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
      },
    ) => {
      const { skip = 0, take = 3, category, minPrice, maxPrice, search } = args;

      const where: any = {
        stock: { gt: 0 },
      };

      if (category) {
        where.categoryId = category;
      }

      if (minPrice != null && maxPrice != null) {
        where.price = {
          gte: minPrice,
          lte: maxPrice,
        };
      }

      if (search) {
        where.name = {
          contains: search,
          mode: "insensitive",
        };
      }

      return prisma.product.findMany({
        where, 
        skip, 
        take,
        include: {
          category: true,
          images: true,
        },
      });
    },
    
    
    getSingleproduct: async (_: any, args: { id: string }) => {
      const { id } = args;

      try {
        const result = await prisma.product.findUnique({
          where: { id },
          include: { category: true, images: true },
        });

        return result;
      } catch (error) {
        console.log(error);
      }
    },

    
    categories: async () => {
      return await prisma.category.findMany();
    },

    
    shipments: async () => {
      return await prisma.shippingRate.findMany();
    },
    
    
    pricefilter: async () => {
      return await prisma.priceFilter.findMany();
    },
  },

  Mutation: {
    createCategory: async (
      _: any,
      args: { name: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorize user" };
      }

      const { name } = args;

      if (!name) {
        return { message: "field is required" };
      }
      try {
        const existing = await prisma.category.findFirst({
          where: { name },
        });

        if (existing) {
          return {
            category: existing,
            message: "Category already exists",
          };
        }

        const category = await prisma.category.create({
          data: { name: args.name },
        });

        return {
          category,
          message: "Category created successfully",
        };
      } catch (error) {
        console.log(error);
      }
    },
    deleteCategory: async (
      _: any,
      { id }: { id: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorize user" };
      }

      try {
        const result = await prisma.category.delete({
          where: { id },
        });

        return {
          message: "Category deleted successfully",
          category: result,
        };
      } catch (error) {
        console.error(error);
      }
    },

    upateCategory: async (
      _: any,
      args: { id: string; name: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorize user" };
      }

      try {
        const { id, name } = args;

        if (!name) {
          return { message: "*field required" };
        }

        const result = await prisma.category.update({
          data: { name },
          where: { id },
        });

        return { category: result };
      } catch (error) {
        console.log(error);
      }
    },

    createProduct: async (_: any, args: { input: any }, context: MyContext) => {
      const {
        name,
        description,
        price,
        stock,
        image,
        imagePublicId,
        categoryId,
        images,
      } = args.input;

      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorized user" };
      }

      try {
        const findproduct = await prisma.product.findFirst({ where: { name } });
        if (findproduct) {
          return { message: "product already exists" };
        }

        const product = await prisma.product.create({
          data: {
            name,
            description,
            price,
            stock,
            image,
            imagePublicId,
            categoryId,
            images: {
              create: images.map((img: { url: string; publicId: string }) => ({
                url: img.url,
                publicId: img.publicId,
                alt: "optional alt text",
              })),
            },
          },
          include: {
            category: true,
            images: true,
          },
        });

        return {
          product,
          message: "Product created successfully",
        };
      } catch (error) {
        console.error(error);
        return {
          product: null,
          message: "Failed to create product",
        };
      }
    },

    updateProduct: async (_: any, args: { input: any }, context: MyContext) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorized user" };
      }

      const {
        id,
        name,
        description,
        price,
        stock,
        image,
        imagePublicId,
        categoryId,
        images,
      } = args.input;

      try {
        const existingProduct = await prisma.product.findUnique({
          where: { id },
          include: { images: true },
        });

        if (!existingProduct) {
          return { product: null, message: "Product not found" };
        }
        const isMainImageChanged =
          imagePublicId && imagePublicId !== existingProduct.imagePublicId;

        if (isMainImageChanged && existingProduct.imagePublicId) {
          await deleteFromCloudinary(existingProduct.imagePublicId);
        }

        const updateData: any = {
          name,
          description,
          price,
          stock,
          categoryId,
          image,
          imagePublicId,
        };

        if (Array.isArray(images) && images.length > 0) {
          updateData.images = {
            create: images.map((img: { url: string; publicId: string }) => ({
              url: img.url,
              publicId: img.publicId,
              alt: "optional alt text",
            })),
          };
        }

        const updatedProduct = await prisma.product.update({
          where: { id },
          data: updateData,
          include: {
            category: true,
            images: true,
          },
        });

        return {
          product: updatedProduct,
          message: "Product updated successfully",
        };
      } catch (error) {
        console.error(error);
        return { product: null, message: "Failed to update product" };
      }
    },

    deleteProduct: async (_: any, args: { id: string }, context: MyContext) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorized user" };
      }

      const { id } = args;

      try {
        const product = await prisma.product.findUnique({
          where: { id },
          include: { images: true },
        });

        if (!product) {
          return { message: "Product not found" };
        }

        // delete main image
        if (product.imagePublicId) {
          await deleteFromCloudinary(product.imagePublicId);
        }

        // delete gallery images
        await Promise.all(
          product.images
            .filter((img) => img.publicId)
            .map((img) => deleteFromCloudinary(img.publicId!)),
        );

        await prisma.product.delete({
          where: { id },
        });

        return { message: "Product deleted successfully" };
      } catch (error) {
        console.error(error);
        return { message: "Failed to delete product" };
      }
    },

    deleteGalleryImage: async (
      _: any,
      args: { id: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { success: false, message: "Unauthorized user" };
      }

      const { id } = args;

      try {
        const image = await prisma.productImage.findUnique({
          where: { id },
        });

        if (!image) {
          return { success: false, message: "Image not found" };
        }

        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }

        await prisma.productImage.delete({
          where: { id },
        });

        return {
          success: true,
          message: "Gallery image deleted successfully",
        };
      } catch (error) {
        console.error("Failed to delete image:", error);
        return { success: false, message: "Error deleting image" };
      }
    },

    createShipment: async (
      _: any,
      args: { city: string; amount: number },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorize user" };
      }

      try {
        const { city, amount } = args;

        if (!city || !amount) {
          return { message: "all fields required" };
        }
        const result = await prisma.shippingRate.create({
          data: {
            city: args.city,
            amount: args.amount,
          },
        });

        return { shipment: result };
      } catch (error) {
        console.log(error);
      }
    },
    updateShipment: async (
      _: any,
      args: { id: string; city: string; amount: number },
    ) => {
      const { id, city, amount } = args;

      if (!city || !amount) {
        return { message: "all fields required" };
      }

      try {
        const result = await prisma.shippingRate.update({
          where: { id },
          data: {
            city: city,
            amount: amount,
          },
        });

        return { shipment: result };
      } catch (error) {
        console.log(error);
      }
    },
    deleteShipment: async (_: any, args: { id: string }) => {
      await prisma.shippingRate.delete({ where: { id: args.id } });
      return true;
    },
    createPriceFilter: async (
      _: any,
      args: { range: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorized" };
      }

      const { range } = args;

      if (!range) {
        return { message: "field is required" };
      }

      try {
        const result = await prisma.priceFilter.create({
          data: { amount: range },
        });

        return { pricerange: result };
      } catch (error) {
        console.log(error);
      }
    },
    updatePriceFilter: async (
      _: any,
      args: { id: string; range: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return { message: "unauthorized" };
      }

      const { id, range } = args;

      if (!id || !range) {
        return { message: "all fields are required" };
      }

      try {
        const existing = await prisma.priceFilter.findUnique({ where: { id } });

        if (!existing) {
          return { message: "Price range not found" };
        }

        const result = await prisma.priceFilter.update({
          where: { id },
          data: { amount: range },
        });

        return { pricerange: result };
      } catch (error) {
        console.error(error);
        return { message: "Something went wrong" };
      }
    },

    deletePriceFilter: async (
      _: any,
      args: { id: string },
      context: MyContext,
    ) => {
      if (context.user?.role !== "ADMIN") {
        return false;
      }

      const { id } = args;

      if (!id) {
        return false;
      }

      try {
        const existing = await prisma.priceFilter.findUnique({ where: { id } });

        if (!existing) {
          return false;
        }

        await prisma.priceFilter.delete({ where: { id } });

        return true;
      } catch (error) {
        console.error(error);
      }
    },
  },
};
