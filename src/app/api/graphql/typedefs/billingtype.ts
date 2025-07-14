export const ordertypes  = /* GraphQL */`

type OrderItem {
  id: ID!
  order: Order!
  orderId: String!
  product: Product!
  productId: String!
  quantity: Int!
  price: Float!
}

type Address {
  id: ID!
  user: User
  userId: String
  name: String!
  email: String!
  street: String!
  city: String!
  state: String!
  postalCode: String!
  country: String!
  isDefault: Boolean!
  orders: [Order!]!
}

type Order {
  id: ID!
  user: User
  userId: String
  subtotal: Float!
  shippingCost: Float!
  total: Float!
  status: OrderStatus!
  createdAt: String!
  address: Address!
  addressId: String!
  payment: Paymentmode!
  orderItems: [OrderItem!]!
}


enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum Paymentmode {
  COD
  STRIPE
}

type Query {
  orders: [Order!]!
  order(id: ID!): Order
  userOrders(email:String!): [Order!]!
  
}

type Mutation{

   updateOrderStatus(id: String!, status: OrderStatus!): Order
}

`








