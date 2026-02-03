import Table from 'cli-table3';
import { WorkspaceMember } from '../api/types';

export function formatWorkspaceMembersTable(
  members: WorkspaceMember[]
): string {
  const table = new Table({
    head: [
      'Member ID',
      'First Name',
      'Last Name',
      'Email',
      'Access Level',
      'Created At',
    ],
    colWidths: [20, 15, 15, 30, 15, 28],
    wordWrap: true,
  });

  members.forEach((member) => {
    table.push([
      member.id.workspace_member_id,
      member.first_name,
      member.last_name,
      member.email_address,
      member.access_level,
      new Date(member.created_at).toISOString(),
    ]);
  });

  return table.toString();
}

export function formatGenericTable(
  data: Array<Record<string, unknown>>
): string {
  if (data.length === 0) {
    return 'No data to display';
  }

  const keys = Object.keys(data[0]);
  const table = new Table({
    head: keys,
  });

  data.forEach((item) => {
    const row = keys.map((key) => {
      const value = item[key];
      if (value === null || value === undefined) {
        return '';
      }
      if (typeof value === 'object') {
        return JSON.stringify(value);
      }
      return String(value);
    });
    table.push(row);
  });

  return table.toString();
}
