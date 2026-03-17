export interface HttpResult<T> {
    error: boolean;
    response: T | null;
    redirect?: string;
}