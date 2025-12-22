import { gql } from "@apollo/client";

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
`;
export const get_category = gql`
  query {
    categories {
      id
      name
    }
  }
`;
export const delete_category = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id) {
      category {
        id
        name
      }
      message
    }
  }
`;

export const update_category = gql`
  mutation ($id: String!, $name: String!) {
    upateCategory(id: $id, name: $name) {
      category {
        id
        name
      }
      message
    }
  }
`;

export const create_poroduct = gql`
  mutation ($input: CreateProductInput) {
    createProduct(input: $input) {
      product {
        id
        name
        description
        image
        imagePublicId
        images {
          url
          publicId
        }
      }
      message
    }
  }
`;

export const get_products = gql`
  query ($skip: Int, $take: Int) {
    products(skip: $skip, take: $take) {
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
`;

export const getsingle_product = gql`
  query ($id: String!) {
    getSingleproduct(id: $id) {
      id
      name
      description
      stock
      price
      image
      imagePublicId
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
`;

export const delete_product = gql`
  mutation ($id: String!) {
    deleteProduct(id: $id) {
      product {
        id
        name
        description
      }

      message
    }
  }
`;

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
  mutation ($id: String!) {
    deleteGalleryImage(id: $id) {
      category {
        id
        name
      }

      message
    }
  }
`;

export const get_shipments = gql`
  query GetShipments {
    shipments {
      id
      city
      amount
    }
  }
`;

export const create_shipment = gql`
  mutation CreateShipment($city: String!, $amount: Float!) {
    createShipment(city: $city, amount: $amount) {
      shipment {
        id
        city
        amount
      }
      message
    }
  }
`;

export const update_shipment = gql`
  mutation UpdateShipment($id: ID!, $city: String!, $amount: Float!) {
    updateShipment(id: $id, city: $city, amount: $amount) {
      shipment {
        id
        city
        amount
      }
      message
    }
  }
`;

export const delete_shipment = gql`
  mutation DeleteShipment($id: ID!) {
    deleteShipment(id: $id)
  }
`;

export const get_price_filter = gql`
  query GetPriceFilters {
    pricefilter {
      id
      amount
    }
  }
`;

export const create_price_filter = gql`
  mutation CreatePriceFilter($range: String!) {
    createPriceFilter(range: $range) {
      pricerange {
        id
        amount
      }
      message
    }
  }
`;

export const update_price_filter = gql`
  mutation UpdatePriceFilter($id: ID!, $range: String!) {
    updatePriceFilter(id: $id, range: $range) {
      pricerange {
        id
        amount
      }
      message
    }
  }
`;

export const delete_price_filter = gql`
  mutation DeletePriceFilter($id: ID!) {
    deletePriceFilter(id: $id)
  }
`;
