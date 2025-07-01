export const producttypes = /* GraphQL */`
  
    scalar DateTime
  
  type Product {
    id: String
    name: String
    description: String
    price: Float
    stock: Int
    image: String
    category: Category
    categoryId: String
    images: [ProductImage]
    createdAt: DateTime
    updatedAt: DateTime
  }

  type ProductWithValid {
    product: Product
    message: String
  }

  type Category {
    id: String
    name: String
  }

  type CategoryWithValid {
    category: Category
    message: String
  }


  type ProductImage {
    id: String
    url: String
    alt: String
    productId: String
  }

  
  input CreateProductInput {
    name: String!
    description: String!
    price: Float!
    stock: Int!
    image: String!   
    categoryId: String!
    images: [String]
  }

  input UpdateProductInput {
  id: String!
  name: String
  description: String
  price: Float
  stock: Int
  image: String
  categoryId: String
  images: [String]
}

  type Query {
    products: [Product!]!
    getSingleproduct(id:String!):Product
    categories:[Category!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput): ProductWithValid
    deleteProduct(id:String!):ProductWithValid
    updateProduct(input:UpdateProductInput):ProductWithValid
    createCategory(name: String!): CategoryWithValid!
    deleteCategory(id: String!): CategoryWithValid!
    upateCategory(id:String!,name:String!):CategoryWithValid!
    deleteGalleryImage(id:String!):CategoryWithValid

  }

`;
