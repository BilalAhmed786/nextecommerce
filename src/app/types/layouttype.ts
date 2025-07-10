export type ProductFormProps = {
  onSubmit: (data: ProductFormData) => void;
  categories: { id: string; name: string }[];
};

export type ProductFormData = {
  id:string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image: string;
  categoryId: string;
};

export type prodCategory = {
  id: string;
  name: string;
};
export interface Props {
  searchParams:Promise <{
    category?: string;
    price?: string;
    search?:string
   
    
  }>;
}

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  Qty: number;
  total: number;
}