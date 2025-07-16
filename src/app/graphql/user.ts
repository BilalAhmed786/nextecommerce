import {gql} from '@apollo/client'

export const register_user = gql `

mutation($name:String!,$email:String!,$password:String!){
registerUser(name:$name,email:$email,password:$password){

  user{
    name
    email
    password
    
    }
    message

 }
}
`

export const get_users = gql `
query {
   users{
      user{
        id
        name,
        email,
        role
      }
      message

    }
  }



`

export const update_user_role = gql `

mutation($id:String!,$role:String!){

updateUser(id:$id,role:$role){
 user{
    name,
    email,
    role
  }
  message

 }

}
`

export const delete_user = gql `

  mutation($id:string){
    deleteUser(id:$id){
      user{
         name,
         email
      }
       

      }

      message


  }
`
export const change_password = gql`
  mutation changePassword($id:String!,$oldpassword: String!, $newpassword: String!) {
    changePassword(id:$id,oldpassword:$oldpassword, newpassword: $newpassword) {
      message
      success
    }
  }
`;

export const forget_password = gql`
  mutation ForgotPassword($email: String!) {
    forgetpassword(email: $email)
  }
`;

export const reset_password = gql`
  mutation ResetPassword($token: String!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      message
      success
    }
  }
`;