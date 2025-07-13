import bcrypt from "bcryptjs"
import { MyContext } from "../route"
import jwt, { JwtPayload } from 'jsonwebtoken'
import { PrismaClient, Role } from "@prisma/client"
import { forgetpasswordLink } from "@/nodemailer/forgetpassword"
const prisma = new PrismaClient()

export const userresolver = {
    Query: {
        users: async (_: any, __: any, context: MyContext) => {

            if (context.user?.role !== "ADMIN") {

                return { message: 'unauthorize' }
            }


            const result = await prisma.user.findMany({})


            return { user: result }
        }
    },

    Mutation: {

        registerUser: async (_: any, args: { name: string, email: string, password: string }) => {
            try {

                const { name, email, password } = args


                if (!name || !email || !password) {


                    return { message: 'all fields required' }
                }

                const userfound = await prisma.user.findUnique({
                    where: { email }
                })

                if (userfound) {

                    return { message: 'user already registerd with this email' }


                }

                const hashpassword = await bcrypt.hash(password, 10)

                if (hashpassword) {


                    const createuser = await prisma.user.create({

                        data: { name, email, password: hashpassword }
                    })

                    return { user: createuser }

                }



            } catch (error) {

                console.log(error)
            }
        },

        updateUser: async (_: any, args: { id: string, role: Role }, context: MyContext) => {

            if (context.user?.role !== 'ADMIN') {


                return { message: 'unauthorize' }
            }

            const { id, role } = args

            if (!role) {

                return { message: 'field is required' }
            }

            const updateuser = await prisma.user.update({
                where: { id },
                data: { role }
            })

            return { user: updateuser }



        },

        deleteUser: async (id: string, context: MyContext) => {

            if (context.user?.role !== 'ADMIN') {

                return { message: 'unauthorize' }
            }

            const result = await prisma.user.delete({

                where: { id }
            })

            return { user: result }

        },

        changePassword: async (_: any, args: { id: string; oldpassword: string; newpassword: string }, context: MyContext) => {


            if (context.user?.role !== 'ADMIN') {

                return { message: "unauthorize" }

            }


            const { id, oldpassword, newpassword } = args;

            if (!oldpassword || !newpassword) {
                return { message: '*All fields required', success: false };
            }

            const user = await prisma.user.findUnique({ where: { id } });

            if (!user) {
                return { message: 'User not found', success: false };
            }

            const isMatch = await bcrypt.compare(oldpassword, user.password);

            if (!isMatch) {
                return { message: 'Incorrect old password', success: false };
            }

            const hashedPassword = await bcrypt.hash(newpassword, 10);

            try {
                await prisma.user.update({
                    where: { id },
                    data: { password: hashedPassword },
                });

                return {
                    message: 'Password updated successfully.',
                    success: true,
                };
            } catch (error) {
                console.error(error);
                return {
                    message: 'Something went wrong. Please try again.',
                    success: false,
                };
            }
        },


        forgetpassword: async (_: any, args: { email: string }) => {

            const { email } = args


            if (!email) {

                return 'All fields requried'
            }


            const finduser = await prisma.user.findUnique({
                where: { email }
            })

            if (!finduser) {


                return 'you are not registerd'

            }

            const token = jwt.sign({ id: finduser.id }, process.env.JWT_SEC as string, { expiresIn: '5m' })

            const resetLink = `http://localhost:3000/resetpassword?token=${token}`;


            await forgetpasswordLink({
                to: email,
                subject: 'Reset Your Password',
                html: `<p>Click the link below to reset your password:</p>
                    
                  <a href="${resetLink}">${resetLink}</a>`,
            });

            return 'Reset link has been sent to your email';
        },
      
        resetPassword: async (_: any, { token, newPassword }: { token: string; newPassword: string }) => {
            try {
                if (!token || !newPassword) {
                    return { message: 'All fields required', success: false };
                }

                console.log('token',token)
                const decoded = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload;

                console.log('verify',decoded)
                if(!decoded){

                    return {message :'token expired try again', success: false }
                }

                const userId = decoded.id;

                const hashedPassword = await bcrypt.hash(newPassword, 10);

                await prisma.user.update({
                    where: { id: userId },
                    data: { password: hashedPassword },
                });

                return {
                    message: 'Password updated successfully',
                    success: true,
                };
            } catch (err) {
                console.error(err);
                 return {
                  message: 'Invalid or expired token',
                 success: false,
               };

            }
        }
    }
}