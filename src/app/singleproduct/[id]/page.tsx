// app/singleproduct/[id]/page.tsx
import { getClient } from '../../lib/apolloSSR';
import { getsingle_product,get_products } from '@/app/graphql/product';
import ProductSlider from '../../components/ProductSlider';
import Shopbutton from '@/app/components/shopbutton';
import ProductQty from '@/app/components/ProductQty';
import MultiProductSlider from '@/app/components/featuredproducts';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
//for gallery images
  const client = getClient();
  const { data } = await client.query({
    query: getsingle_product,
    variables: { id },
    fetchPolicy: 'no-cache'
  });

//for feature prodcuts

const {data:allproducts} = await client.query({
  query:get_products
})

const featuredproducts = allproducts.products.filter((product:any)=>product.id !== id)



  const product = data?.getSingleproduct;
  if (!product) return <div>Product not found</div>;

  const gallery = [product.image, ...product.images.map((g: any) => g.url)];

  return (
    <div className='flex flex-col justify-center items-center gap-4 mb-10'>
      <ProductSlider images={gallery} />
      <div className=''>
        <h1 className="text-2xl font-bold text-center mb-5">{product.name}</h1>
        <p className="w-[300px]">{product.description}</p>
        <p className='font-bold text-blue-700'>${product.price}</p>

        <div className='flex gap-3 mt-4'>

          Qunatity: <ProductQty product={product} />

          <div><Shopbutton product={product} /></div>
        </div>
      </div>

      <div>

        <MultiProductSlider products={featuredproducts}/>
      </div>

    </div>

  );
}
