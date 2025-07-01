import { mergeResolvers,mergeTypeDefs } from "@graphql-tools/merge";
import { userresolver } from "../resolvers/userresolver";
import { usertypes } from "../typedefs/usertypes";
import { productresolvers } from "../resolvers/productresolver";
import { producttypes } from "../typedefs/producttypes";

export const resolvers = mergeResolvers([userresolver,productresolvers])
export const typeDefs = mergeTypeDefs([usertypes,producttypes])