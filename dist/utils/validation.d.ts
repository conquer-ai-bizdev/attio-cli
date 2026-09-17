import { z } from 'zod';
export declare function validate<T>(schema: z.ZodSchema<T>, data: unknown): T;
export declare function isUUID(value: string): boolean;
export declare function isSlug(value: string): boolean;
export declare function validateUUID(value: string): void;
export declare function validateSlug(value: string): void;
//# sourceMappingURL=validation.d.ts.map