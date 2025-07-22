export const dynamic = 'force-dynamic';
import { getClient } from './lib/apolloSSR';
import { get_products } from '@/app/graphql/product';
import Shopcontent from './components/shop/shopcontent';

export default async function ShopPage() {
  const { data } = await getClient().query({
    query: get_products,
    variables: { skip: 0, take:3},
  });

  const filterdata = data.products.filter((prod:any)=>prod.stock !== 0)

  return <Shopcontent initialProducts={filterdata} />;
}
