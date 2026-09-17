export declare class AttioClient {
    private axiosInstance;
    private readonly apiKeyOverride?;
    constructor(apiKeyOverride?: string);
    private request;
    private handleError;
    private sleep;
    get<T>(path: string, params?: Record<string, unknown>): Promise<T>;
    post<T>(path: string, data?: unknown): Promise<T>;
    postForm<T>(path: string, data: FormData): Promise<T>;
    getBinary(path: string): Promise<Buffer>;
    patch<T>(path: string, data?: unknown): Promise<T>;
    put<T>(path: string, data?: unknown): Promise<T>;
    delete<T>(path: string): Promise<T>;
}
//# sourceMappingURL=client.d.ts.map