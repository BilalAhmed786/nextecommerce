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

  
  type ProductImage {
    id: String
    url: String
    alt: String
    productId: String
  }

  type Category {
    id: String
    name: String
  }

  type CategoryWithValid {
    category: Category
    message: String
  }

  type Shipment {
  id: ID!
  city: String!
  amount: Float!
}

type shippingrateWithvalid{

shipment:Shipment
message:String

}

type PriceFilter {
  id: ID!
  amount:String
}

type PriceFilterwithvalid{

  pricerange:PriceFilter
  message:String
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
    # for product
    products(skip: Int, take: Int): [Product!]!
    getSingleproduct(id:String!):Product
    
    # for category
    categories:[Category!]!
    
    # for shipment

    shipments: [Shipment!]!

    #price filter

    pricefilter:[PriceFilter!]!


  }

  type Mutation {
    # for product
    createProduct(input: CreateProductInput): ProductWithValid
    deleteProduct(id:String!):ProductWithValid
    updateProduct(input:UpdateProductInput):ProductWithValid
    deleteGalleryImage(id:String!):CategoryWithValid
    # for category
    createCategory(name: String!): CategoryWithValid!
    deleteCategory(id: String!): CategoryWithValid!
    upateCategory(id:String!,name:String!):CategoryWithValid!
    
    # for shipment
    createShipment(city: String!, amount: Float!): shippingrateWithvalid!
    updateShipment(id: ID!, city: String!, amount: Float!):shippingrateWithvalid!
    deleteShipment(id: ID!): Boolean!

    #price filter
    createPriceFilter(range: String!): PriceFilterwithvalid!
    updatePriceFilter(id: ID!, range: String!): PriceFilterwithvalid!
    deletePriceFilter(id: ID!): Boolean!
  

  }

`;
