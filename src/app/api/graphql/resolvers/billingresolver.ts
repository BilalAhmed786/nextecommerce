import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

export const orderResolvers = {
    Query: {
        orders: async () => {
            return prisma.order.findMany({
                include: {
                    user: true,
                    address: true,
                    orderItems: {
                        include: { product: true },
                    },
                },
            });
        },

        order: async (_: any, args: { id: string }) => {
            return prisma.order.findUnique({
                where: { id: args.id },
                include: {
                    user: true,
                    address: true,
                    orderItems: {
                        include: { product: true },
                    },
                },
            });
        },
        userOrders: async (_: any, args: { email: string }) => {
            return prisma.order.findMany({
                where: {
                    address: {
                        email: args.email,
                    },
                },
                include: {
                    address: true,
                    orderItems: {
                        include: { product: true },
                    },
                },
            });
        },
    },

    Mutation: {
        updateOrderStatus: async (_: any, { id, status }: { id: string, status: OrderStatus }) => {
            return await prisma.order.update({
                where: { id },
                data: { status },
            });
        },
    }

};
