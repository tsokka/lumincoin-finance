type OptionsPattern = { pattern: RegExp };
type OptionsCompareTo = { compareTo: string };
type OptionsCheckProp = { checkProperty: boolean };
type OptionsChecked = { checked: boolean };

export type ValidationOptions =
    | OptionsPattern
    | OptionsCompareTo
    | OptionsCheckProp
    | OptionsChecked;

export type ValidationItem = {
    element: HTMLInputElement | HTMLSelectElement | null;
    options?: ValidationOptions;
};