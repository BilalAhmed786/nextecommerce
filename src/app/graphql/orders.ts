// graphql/orders.ts
import { gql } from '@apollo/client';

export const orders_detail = gql`
  query Orders {
    orders {
      id
      total
      status
      payment
      address {
        name
        email
      
      }
     
    }
  }
`;
export const get_single_order = gql`
  query ($id: ID!) {
    order(id: $id) {
      id
      subtotal
      shippingCost
      total
      status
      payment
      createdAt
     
      address {
        name
        email
        street
        city
        country
      }
      orderItems {
        product {
          name
          image 
        }
        quantity
        price
      }
    }
  }
`;


export const update_order_status = gql`
  mutation UpdateOrderStatus($id: String!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const order_by_email = gql`
query OrdersByEmail($email: String!) {
  userOrders(email: $email) {
    id
    total
    status
    payment
    createdAt
    address {
      name
      email
    }
  }
}`


export const get_address = gql`
  query GetAddress($email: String!) {
    address(email: $email) {
      id
      userId
      name
      email
      street
      city
      state
      postalCode
      country
      isDefault
    }
  }
`;

export const update_address = gql`
  mutation UpdateAddress($input: orderaddress!) {
    updateAddress(input: $input)
  }
`;
