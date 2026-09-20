export interface NormalizedRecordWrite {
    values: unknown;
    requestedCurrencies: Record<string, string>;
}
export declare function formatRecord(record: unknown): unknown;
export declare function formatRecords(records: unknown[]): unknown[];
export declare function formatRecordSearchResponse(response: unknown): unknown;
export declare function normalizeRecordWriteValues(values: unknown): NormalizedRecordWrite;
export declare function assertRequestedCurrencies(record: unknown, requestedCurrencies: Record<string, string>): void;
//# sourceMappingURL=record.d.ts.map