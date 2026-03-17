export interface Operation {
    id: number;
    type: 'income' | 'expense';
    amount: number;
    date: string;
    comment: string;
    category?: string;
}

export interface ChartData {
    labels: string[];
    data: number[];
}

export interface OperationResponse {
    error?: boolean;
}