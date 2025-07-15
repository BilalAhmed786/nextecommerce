// app/singleproduct/[id]/page.tsx
import { getClient } from '../../lib/apolloSSR';
import { getsingle_product, get_products } from '@/app/graphql/product';
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

  const { data: allproducts } = await client.query({
    query: get_products
  })

  const featuredproducts = allproducts.products.filter((product: any) => product.id !== id)



  const product = data?.getSingleproduct;
  if (!product) return <div>Product not found</div>;

  const gallery = [product.image, ...product.images.map((g: any) => g.url)];

  return (
    <div className='mt-20 w-[80%] m-auto'>
      <div className='flex gap-4 flex-wrap justify-center'>
        <ProductSlider images={gallery} />
          <div className='relative'>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="w-[320px] lg:w-[450px] md:[450] m-auto text-justify mt-2">{product.description}</p>
          <p className='left-0 absolute md:left-20 lg:left-0'>${product.price}</p>

          <div className='flex mt-6 gap-4 justify-center md:justify-center lg:justify-start'>
                Qunatity: <ProductQty product={product} />
                <Shopbutton product={product} />
          </div>
        </div>
        </div>
      
      

      <div>

        <MultiProductSlider products={featuredproducts} />
      </div>

    </div>

  );
}
