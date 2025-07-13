
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

type userRestrict{

user:[User!]!
message:String

}


type Query {
  users:userRestrict!
}


type ResetPasswordResponse {
  message: String!
  success: Boolean!
}

type Mutation{

registerUser(name:String!,email:String!,password:String!):userWithvalid
updateUser(id:String!,role:String!):userWithvalid
deleteUser(id:String!):userRestrict!
changePassword(id:String!,oldpassword: String!, newpassword: String!): ResetPasswordResponse!
forgetpassword(email:String!):String!
resetPassword(token: String!, newPassword: String!): ResetPasswordResponse!

}

`