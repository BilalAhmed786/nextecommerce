export type ProductFormProps = {
  onSubmit: (data: ProductFormData) => void;
  categories: { id: string; name: string }[];
};

export type ProductFormData = {
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