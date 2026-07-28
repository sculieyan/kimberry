/* ------------------------------------------------------------------ */
/*  Kimberry product catalog — single source of truth                  */
/*                                                                     */
/*  Shared by the shop UI and server-side API routes (Stripe checkout  */
/*  re-derives prices from this list — never trust client prices).     */
/* ------------------------------------------------------------------ */

export interface Product {
  id: string;
  category: string;
  name: string;
  size: string;
  originalPrice: number;
  price: number;
  weightGrams: number;
  freeShipping?: boolean;
  image: string;
  desc: string;
}

export const PRODUCTS: Product[] = [
  { id: 'oat-unsweetened', category: 'Milk Oat Flakes', name: 'Unsweetened', size: '400g · 10 sachets', originalPrice: 24.90, price: 19.90, weightGrams: 400, freeShipping: true, image: '/products/unsweetened_milk_oats.png', desc: 'A clean oat and milk base for a naturally simple everyday breakfast.' },
  { id: 'oat-classic', category: 'Milk Oat Flakes', name: 'Classic', size: '400g · 10 sachets', originalPrice: 24.90, price: 19.90, weightGrams: 400, image: '/products/classic_milk_oatmeal_front.png', desc: 'Lightly sweetened with creamy New Zealand milk and natural oat texture.' },
  { id: 'oat-coconut', category: 'Milk Oat Flakes', name: 'Coconut', size: '400g · 10 sachets', originalPrice: 26.90, price: 21.90, weightGrams: 400, image: '/products/unsweetened_milk_oats.png', desc: 'Creamy oats with a gentle coconut finish for a softer tropical profile.' },
  { id: 'bean-dark', category: 'Milk Beans', name: 'Dark Chocolate Chips', size: '150g', originalPrice: 18.90, price: 15.90, weightGrams: 150, image: '/products/milk_beans_front.png', desc: 'Creamy milk bites balanced with crisp dark chocolate pieces.' },
  { id: 'bean-coconut', category: 'Milk Beans', name: 'Coconut', size: '150g', originalPrice: 18.90, price: 15.90, weightGrams: 150, image: '/products/milk_beans_front.png', desc: 'Smooth dairy flavour with gentle coconut notes for everyday snacking.' },
  { id: 'quick-oats', category: 'Quick Oats', name: 'Original', size: '800g', originalPrice: 15.90, price: 12.90, weightGrams: 800, freeShipping: true, image: '/products/oats_front.png', desc: '100% wholegrain oats for porridge, overnight oats, smoothies and baking.' },
];

export const findProduct = (id: string): Product | undefined =>
  PRODUCTS.find(p => p.id === id);
