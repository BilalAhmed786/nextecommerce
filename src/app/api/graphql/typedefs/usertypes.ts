
export const usertypes =/* GraphQL */ `
scalar DateTime
type User{
id:String!
name:String!
email:String!
password:String!
role: String!
createdAt:DateTime!
updatedAt:DateTime!
}

type userWithvalid{
user:User
message:String

}

type Query {
  users:String!
}

type Mutation{

registerUser(name:String!,email:String!,password:String!):userWithvalid

}

`