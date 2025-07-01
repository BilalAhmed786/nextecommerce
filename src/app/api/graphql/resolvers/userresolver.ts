import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
export const userresolver ={
 Query: {
    users:()=>{
      
        return 'hello world'
    }
  },

Mutation:{

registerUser:async(_:any,args:{name:string,email:string,password:string})=>{
    try{

        const {name,email,password} = args


        if(!name || !email ||!password){


            return {message:'all fields required'}
        }

        const userfound = await prisma.user.findUnique({
            where:{email}
        })

        if(userfound){
  
             return {message:'user already registerd with this email'}


        }

        const hashpassword = await bcrypt.hash(password,10)

        if(hashpassword){


            const createuser = await prisma.user.create({

                data:{name,email,password:hashpassword}
            })

            return {user:createuser}

        }



    }catch(error){

        console.log(error)
    }
}


}




}