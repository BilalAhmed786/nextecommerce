import { PrismaClient, orderStatus } from '@prisma/client';

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

        address: async (_: any, args: { email: string }) => {

            const { email } = args

            return await prisma.address.findFirst({
                where: { email },
                orderBy: {
                    id: 'desc'
                }
            })



        }
    },

    Mutation: {
        updateOrderStatus: async (_: any, { id, status }: { id: string, status: orderStatus }) => {
            return await prisma.order.update({
                where: { id },
                data: { status },
            });
        },

        updateAddress: async (
            _: any,
            args: {
                input:{
                userid: string;
                name: string;
                email: string;
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
             } 
            },
            context: { user: { id: string } }
        ) => {
            const { userid, name, email, street, city, state, postalCode, country } = args.input;

                
            if (!name || !email || !street || !city || !state || !postalCode || !country) {


                return "All fields requried"
            }


            if (userid !== context.user.id) {

                return "unauthorize"

            }




            const updated = await prisma.address.updateMany({
                where: { email },
                data: { name, email, street, city, state, postalCode, country }
            });



            return "update successfully";
        }

    }

};
