'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { get_category, update_product, getsingle_product, deletegallery_image } from '@/app/graphql/product';
import axios from 'axios';

interface dataImages {
  id: string
  url: string
}


export default function EditProductForm() {
  const param = useParams();
  const id = param?.id
  const router = useRouter();
  const { data: productData, loading, refetch } = useQuery(getsingle_product, { variables: { id } });
  const { data: categoryData } = useQuery(get_category);
  const [updateProduct] = useMutation(update_product);
  const [deletgalleryimg] = useMutation(deletegallery_image)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    price: 1,
    stock: 1,
    image: '',
    categoryId: '',

  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [imagesFiles, setImagesFiles] = useState<(File | dataImages)[]>([]);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const otherImagesRef = useRef<HTMLInputElement>(null);
  const [valdiation, setValid] = useState('')


  useEffect(() => {
    if (productData?.getSingleproduct) {
      const { name, description, price, stock, category, image, images } = productData.getSingleproduct;

      setFormValues({ name, description, price, stock, image, categoryId: category.id });
      setImagesFiles(images)

    }
  }, [productData]);


 
  function getImagePreview(image: File | dataImages) {
    return image instanceof File ? URL.createObjectURL(image) : image.url;
  }


 
  const handleRemoveImage = async (index: number, id: string | null) => {

    setImagesFiles((prev) => prev.filter((_, i) => i !== index))

    if (id) {

      const { data } = await deletgalleryimg({

        variables: { id }
      })

    

    }

  };


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: ['price', 'stock'].includes(name) ? Number(value) : value,
    }));
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMainImageFile(file);

  };


  const handleOtherImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImagesFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
   

    if (
      (!mainImageFile && !formValues.image)
      || (!imagesFiles.length && !productData.getSingleproduct.images.length)
      || !imagesFiles.length
      || !formValues.name
      || formValues.price === 0
      || !formValues.description
      || !formValues.categoryId) {

      setValid('*All fields requried')
      return
    }



    let imageUrl = formValues?.image;

    if (mainImageFile) {
      const form = new FormData();
      form.append('image', mainImageFile);
      const { data } = await axios.post('/api/upload/main', form);
      imageUrl = data.imageUrl;
    }


    const filesOnly = imagesFiles.filter(item => item instanceof File) as File[];

    let galleryUrls: string[] = [];

    if (filesOnly.length > 0) {

      const form = new FormData();
      filesOnly.forEach(file => form.append('images', file));

      const { data } = await axios.post('/api/upload/images', form);
      galleryUrls = data.imageUrls;
    }




    try {
      const { data } = await updateProduct({
        variables: {
          input: {
            ...formValues,
            id,
            image: imageUrl,
            images: galleryUrls,
          }
        }
      });

      if (data.updateProduct.message) {

        await refetch()
        router.push('/authorize/admin/allproducts');
      }


    } catch (err) {
      console.error('Update failed', err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mt-20 mx-auto p-4 space-y-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold text-center">Update Product</h2>
      
      <label className='font-bold'>Name</label><br />
      <input type="text" name="name" value={formValues.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
      
      <label className='font-bold'>Description</label><br />
      <textarea name="description" value={formValues.description} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Description" />
        
        <label className='font-bold'>Price</label><br />
        <input type="number" name="price" value={formValues.price} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Price" />
      
        <label className='font-bold'>Stock</label><br />
        <input type="number" name="stock" value={formValues.stock} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Stock" />
      

      <select name="categoryId" value={formValues.categoryId} onChange={handleChange} className="w-full border p-2 rounded">
        <option value=''>Select category</option>
        {categoryData?.categories.map((cat: any) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <div className='relative'>
        <label className='font-bold'>Main Image</label><br />
        <input type="file" accept="image/*" onChange={handleMainImageChange} ref={mainImageRef} />
        {!mainImageFile ?
          <img src={productData.getSingleproduct?.image} className="w-24 h-24 object-cover mt-2" />
          :
          <div className='relative'>
            <img src={URL.createObjectURL(mainImageFile)} className="w-24 h-24 object-cover mt-2" />
            <button className='absolute text-white top-0 bg-amber-600 rounded-full px-1 text-xs cursor-pointer'
              onClick={() => setMainImageFile(null)}
            >
              X
            </button>
          </div>

        }
      </div>

      <div>
        <label className='font-bold'>Gallery Images</label><br />
        <input type="file" accept="image/*" multiple onChange={handleOtherImagesChange} ref={otherImagesRef} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {imagesFiles.map((img, idx) => (
            <div key={idx} className='relative'>
              <img key={idx} src={getImagePreview(img)} className="h-20 w-20 object-cover rounded" />
              <button
                className='absolute text-white top-0 bg-amber-600 rounded-full px-1 text-xs cursor-pointer'
                onClick={() => handleRemoveImage(idx, 'id' in img ? img.id : null)}
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      {valdiation ? <div className='text-red-500 text-center'>{valdiation}</div> : ""}
      <button type="submit" className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 w-full">
        Update Product
      </button>
    </form>
  );
}
