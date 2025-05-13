//Product Type
export interface Product {
    id: string;
    name: string;
    description: string;
    category?: string;
    imagePublicId: string;
    inStock: boolean;
    featured: boolean;
    tags?: string[];
    slug: string;
}
