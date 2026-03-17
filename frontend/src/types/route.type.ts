export interface Route {
    route: string;
    title?: string;
    filePathTemplate?: string;
    useLayout?: string | false;
    load?: () => void;
    scripts?: string[];
    styles?: string[];
}