import { AttioClient } from '../client';
import {
  WorkspaceMembersResponseSchema,
  WorkspaceMemberSchema,
  WorkspaceMember,
  WorkspaceIdentitySchema,
  WorkspaceIdentity,
} from '../types';
import { validate } from '../../utils/validation';

export interface ListWorkspaceMembersOptions {
  limit?: number;
  offset?: number;
}

export class WorkspaceEndpoints {
  constructor(private client: AttioClient) {}

  async getCurrentIdentity(): Promise<WorkspaceIdentity> {
    const response = await this.client.get('/self');
    return validate(WorkspaceIdentitySchema, response);
  }

  async listMembers(
    options?: ListWorkspaceMembersOptions
  ): Promise<WorkspaceMember[]> {
    const response = await this.client.get('/workspace_members', {});
    const validated = validate(WorkspaceMembersResponseSchema, response);

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

  async getMember(workspaceMemberId: string): Promise<WorkspaceMember> {
    const response = await this.client.get(
      `/workspace_members/${workspaceMemberId}`
    );
    // API returns data wrapped in { data: { ... } } format
    const dataResponse = response as { data: unknown };
    return validate(WorkspaceMemberSchema, dataResponse.data);
  }
}
