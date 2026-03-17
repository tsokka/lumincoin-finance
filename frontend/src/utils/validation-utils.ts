import type {ValidationItem, ValidationOptions} from "../types/validation-item.type";

export class ValidationUtils {
    public static validateForm(validations: ValidationItem[]): boolean {
        let isValid: boolean = true;

        for (const item of validations) {
            if (!ValidationUtils.validateField(item.element, item.options)) {
                isValid = false;
            }
        }

        return isValid;
    }

    private static validateField(element: HTMLInputElement | HTMLSelectElement | null, options?: ValidationOptions): boolean {
        let condition: string | RegExpMatchArray | boolean | null | undefined = element?.value;

        if (options) {
            if ('pattern' in options) {
                condition = element?.value && element.value.match(options.pattern);
            } else if ('compareTo' in options) {
                condition = element?.value && element.value === options.compareTo;
            } else if ('checkProperty' in options) {
                condition = options.checkProperty
            } else if ('checked' in options) {
                condition = element instanceof HTMLInputElement ? element.checked : false;
            }
        }

        if (condition) {
            element?.classList.remove('is-invalid');
            return true;
        } else {
            element?.classList.add('is-invalid');
            return false;
        }
    }
}