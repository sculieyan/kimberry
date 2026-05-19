import { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Products | Kimberry New Zealand Dairy Products',
}

export default function Page() {
  return <div><ProductsClient /></div>;
}