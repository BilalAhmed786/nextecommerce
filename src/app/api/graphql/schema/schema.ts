import { mergeResolvers,mergeTypeDefs } from "@graphql-tools/merge";
import { userresolver } from "../resolvers/userresolver";
import { usertypes } from "../typedefs/usertypes";
import { productresolvers } from "../resolvers/productresolver";
import { producttypes } from "../typedefs/producttypes";
import { ordertypes } from "../typedefs/billingtype";
import { orderResolvers } from "../resolvers/billingresolver";


export const resolvers = mergeResolvers([userresolver,productresolvers,orderResolvers])
export const typeDefs = mergeTypeDefs([usertypes,producttypes,ordertypes])