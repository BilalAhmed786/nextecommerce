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