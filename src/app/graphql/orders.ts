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
