export interface NormalizedRecordWrite {
    values: unknown;
    requestedCurrencies: Record<string, string>;
}
export interface SplitRecordUpdate {
    clearValues: Record<string, never[]>;
    writeValues: unknown;
}
export declare function formatRecord(record: unknown): unknown;
export declare function formatRecords(records: unknown[]): unknown[];
export declare function formatRecordSearchResponse(response: unknown): unknown;
export declare function normalizeRecordWriteValues(values: unknown): NormalizedRecordWrite;
export declare function splitRecordUpdateValues(values: unknown): SplitRecordUpdate;
export declare function assertRequestedCurrencies(record: unknown, requestedCurrencies: Record<string, string>): void;
//# sourceMappingURL=record.d.ts.map