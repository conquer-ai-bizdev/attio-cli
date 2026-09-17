"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceEndpoints = void 0;
const types_1 = require("../types");
const validation_1 = require("../../utils/validation");
class WorkspaceEndpoints {
    client;
    constructor(client) {
        this.client = client;
    }
    async getCurrentIdentity() {
        const response = await this.client.get('/self');
        return (0, validation_1.validate)(types_1.WorkspaceIdentitySchema, response);
    }
    async listMembers(options) {
        const response = await this.client.get('/workspace_members', {});
        const validated = (0, validation_1.validate)(types_1.WorkspaceMembersResponseSchema, response);
        let members = validated.data;
        // Apply offset and limit client-side since API doesn't support it
        if (options?.offset !== undefined) {
            members = members.slice(options.offset);
        }
        if (options?.limit !== undefined) {
            members = members.slice(0, options.limit);
        }
        return members;
    }
    async getMember(workspaceMemberId) {
        const response = await this.client.get(`/workspace_members/${workspaceMemberId}`);
        // API returns data wrapped in { data: { ... } } format
        const dataResponse = response;
        return (0, validation_1.validate)(types_1.WorkspaceMemberSchema, dataResponse.data);
    }
}
exports.WorkspaceEndpoints = WorkspaceEndpoints;
//# sourceMappingURL=workspace.js.map