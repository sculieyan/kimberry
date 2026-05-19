export type Category = {
    id: string;
    name: string;
    image: string | null;
    slogan: string | null;
    updatedAt: string;
    products: Product[];
    categoryDetails: CategoryDetails[] | null;
}

export type CategoryDetails = {
    id: string;
    title: string;
    image: string;
    description: string;
}

export type Product = {
    id: string;
    name: string;
    image: string;
    RDI: string | null;
    allergens: string | null;
    directions: string | null;
    description: string;
    ingredients: string;
    servingPerPackage: number;
    servingSize: number;
    healthRating: number | null;
    nutritionalFacts: NutritionalFact[];
}

export type NutritionalFact = {
    id: string;
    nutrientName: string;
    perServing: number;
    per100g: number;
    dailyIntakePercentage: number | null;
    parentFactId: string | null;
    unit: string;
    createdAt: string;
    updatedAt: string;
}

export interface ContentElement {
    content: string;
    type?: string;
}

export interface AnswerContent {
    type: string;
    content?: string | string[];
    items?: string[];
    title?: string;
}

export type FAQ = {
    id: string;
    category: string;
    question: string;
    createdAt: string;
    updatedAt: string;
    answer: AnswerContent[];

}