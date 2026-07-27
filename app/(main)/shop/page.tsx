import { Metadata } from 'next';
import ShopClient from './ShopClient';

export const metadata: Metadata = {
  title: 'Shop | Kimberry New Zealand Dairy Products',
  description:
    'Shop Kimberry\'s New Zealand-made oat and milk favourites — clean ingredients, calm flavours, straightforward local delivery.',
};

export default function Page() {
  return <ShopClient />;
}
