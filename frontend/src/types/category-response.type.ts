export interface CategoryResponse {
    id?: number;
    title?: string;
    error?: boolean;
    redirect?: string;

    [key: string]: unknown;
}

export interface Category {
    id: number;
    title: string;
}
