import { AttioClient } from '../client';
import { WorkspaceMember, WorkspaceIdentity } from '../types';
export interface ListWorkspaceMembersOptions {
    limit?: number;
    offset?: number;
}
export declare class WorkspaceEndpoints {
    private client;
    constructor(client: AttioClient);
    getCurrentIdentity(): Promise<WorkspaceIdentity>;
    listMembers(options?: ListWorkspaceMembersOptions): Promise<WorkspaceMember[]>;
    getMember(workspaceMemberId: string): Promise<WorkspaceMember>;
}
//# sourceMappingURL=workspace.d.ts.map