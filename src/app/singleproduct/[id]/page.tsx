import { getClient } from '../../lib/apolloSSR';
import { getsingle_product, get_products } from '@/app/graphql/product';
import ProductSlider from '../../reusablecomponent/ProductSlider';
import Shopbutton from '@/app/reusablecomponent/shopbutton';
import ProductQty from '@/app/components/productsinglepage/ProductQty';
import MultiProductSlider from '@/app/reusablecomponent/featuredproducts';



export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
    <div>
    <div className='mt-20 w-[80%] m-auto'>
      <div className='flex gap-4 flex-wrap justify-center'>
        <ProductSlider images={gallery} />
        <div className=''>
          <h1 className="text-xl lg:text-2xl md:text-xl lg:font-bold sm:font-medium">{product.name}</h1>
          <p className="w-[320px] lg:w-[450px] md:[480] text-justify hyphens-auto max-w-prose mt-2">{product.description}</p>
          <p className='mt-5'>  ${product.price}</p>
          <div className='relative flex mt-6 gap-4'>
            Qunatity: <ProductQty product={product} />
            <div className='absolute left-36'><Shopbutton product={product} /></div>
          </div>
        </div>
      </div>
    </div>
     <div className='mt-15 mb-15'>

        <MultiProductSlider products={featuredproducts} />
      
      </div>

  </div>

  );
}
