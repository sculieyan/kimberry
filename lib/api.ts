import { redirect } from 'next/navigation'

type FetchOptions = {
    endpoint: string;
    revalidate?: number;
    errorStrategy?: 'redirect' | 'empty-array';
    queryParams?: Record<string, string>;
}

export const fetchApiData = async <T>({
    endpoint,
    revalidate = 3600,
    errorStrategy = 'empty-array',
    queryParams = {}
}: FetchOptions): Promise<T> => {
    try {
        const queryString = new URLSearchParams(queryParams).toString();
        const url = `https://www.kimberry.co.nz/api${endpoint}${queryString ? `?${queryString}` : ''}`;
        const result = await fetch(url, {
            next: { revalidate },
            cache: 'force-cache',
        });

        if (!result.ok) {
            if (errorStrategy === 'redirect') {
                redirect('/404');
            }
            console.log('result', result);
            return [] as T;
        }

        const data = await result.json();

        if (endpoint.startsWith('/products/') && (!data || !data.product) && errorStrategy === 'redirect') {
            redirect('/404');
        }

        return data;
    } catch (error) {
        console.error(`Failed to fetch data from ${endpoint}:`, error);
        if (errorStrategy === 'redirect') {
            redirect('/404');
        }
        return [] as T;
    }
};