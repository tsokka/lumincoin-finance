export interface DateInputElement extends HTMLInputElement {
    _flatpickr?: {
        setDate: (date: string) => void;
    };
}