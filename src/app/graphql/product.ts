import { gql } from '@apollo/client'

export const create_category = gql`

mutation CreateCategory($name: String!) {
  createCategory(name: $name) {
    category {
      id
      name
    }
     message
  }
}


`
export const get_category = gql`

query{
 categories{
   id
   name

 }

}
`
export const delete_category = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
     category{
      id
      name

     }
     message
    }
  }
`;

export const update_category = gql`
  mutation ($id: String!,$name:String!) {
    upateCategory(id: $id,name:$name) {
     category{
      id
      name
    }
     message
    }
  }
`;

export const create_poroduct = gql`

mutation($input:CreateProductInput){

createProduct(input:$input){
product{
  id
  name
  description
}
 message

}

}
`

export const get_products = gql`

query{
 products{
  id
  name
  description
  stock
  price
  image
  category {
    id
    name
  }
  categoryId
  images {
    url
  }
   

 }

}
`

export const getsingle_product = gql `

query($id:String!){

getSingleproduct(id:$id){

  id
  name
  description
  stock
  price
  image
  category {
    id
    name
  }
  images {
    id
    url
  }


}


}



`

export const delete_product = gql`

mutation($id:String!){
  deleteProduct(id:$id){
  product{
   id
   name
   description
  }
 
  message
}

}
`


export const update_product = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      message
      product {
        id
        name
      }
    }
  }
`;

export const deletegallery_image = gql`
  mutation ($id:String!) {
    deleteGalleryImage(id:$id){
    category{
        id
        name
      }
      
       message
   
      }
      
  }
`;
