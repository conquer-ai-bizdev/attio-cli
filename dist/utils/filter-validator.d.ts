export interface FilterValidationResult {
    valid: boolean;
    errors: string[];
}
/**
 * Validates basic filter structure (not exhaustive)
 */
export declare function validateFilterStructure(filter: unknown): FilterValidationResult;
//# sourceMappingURL=filter-validator.d.ts.map