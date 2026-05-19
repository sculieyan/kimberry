import { MetadataRoute } from 'next';
import type { Category } from '@/app/(main)/types/types';
import { createSlug } from '@/lib/urlUtils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.kimberry.co.nz';
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
    ];

    try {
        const result = await fetch(`${baseUrl}/api/categories`);

        if (!result.ok) {
            console.error('Failed to fetch categories for sitemap');
            return staticRoutes;
        }

        const data = await result.json();
        const categories: Category[] = data.categories || [];

        if (!Array.isArray(categories)) {
            console.error('Categories is not an array');
            return staticRoutes;
        }

        return [
            ...staticRoutes,
            ...categories.map((category) => ({
                url: `${baseUrl}/products/${createSlug(category.name)}`,
                lastModified: category.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })),
            ...categories.flatMap((category) =>
                Array.isArray(category.products)
                    ? category.products.map((product) => ({
                        url: `${baseUrl}/products/${createSlug(category.name)}/${createSlug(product.name)}`,
                        lastModified: category.updatedAt,
                        changeFrequency: 'weekly' as const,
                        priority: 0.7,
                    }))
                    : []
            )
        ];
    } catch (error) {
        console.error('Error generating sitemap:', error);
        return staticRoutes;
    }
}