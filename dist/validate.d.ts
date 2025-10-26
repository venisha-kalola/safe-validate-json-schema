export type FriendlyError = {
    path: string;
    message: string;
    keyword?: string;
    suggestion?: string;
    received?: string;
    expected?: string;
};
export type ValidationResult = {
    valid: boolean;
    errors: FriendlyError[];
};
export declare function validateWithFriendlyErrors(schema: object, data: any): ValidationResult;
