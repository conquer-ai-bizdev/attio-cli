import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { EmailEndpoints } from '../../../../src/api/endpoints/emails';

const email = (emailId: string) => ({
  id: {
    workspace_id: '9780942b-3be5-4d62-b188-a0bd03da1aeb',
    mailbox_id: 'mailbox-id',
    email_id: emailId,
  },
  sent_at: '2026-09-17T00:00:00.000Z',
  direction: 'outbound' as const,
  subject_line: 'Example',
  participants: [],
  linked_records: [],
});

describe('EmailEndpoints', () => {
  let mockClient: AttioClient;
  let emails: EmailEndpoints;

  beforeEach(() => {
    mockClient = { get: vi.fn() } as unknown as AttioClient;
    emails = new EmailEndpoints(mockClient);
  });

  it('omits unused optional filters', async () => {
    vi.mocked(mockClient.get).mockResolvedValue({
      data: [],
      pagination: { next_cursor: null },
    });

    await emails.listEmailsPage({ domain: 'example.com' });

    expect(mockClient.get).toHaveBeenCalledWith('/emails', {
      limit: 25,
      domain: 'example.com',
    });
  });

  it('continues through an empty page while a cursor exists', async () => {
    vi.mocked(mockClient.get)
      .mockResolvedValueOnce({
        data: [email('first')],
        pagination: { next_cursor: 'cursor-1' },
      })
      .mockResolvedValueOnce({
        data: [],
        pagination: { next_cursor: 'cursor-2' },
      })
      .mockResolvedValueOnce({
        data: [email('last')],
        pagination: { next_cursor: null },
      });

    const result = await emails.listAllEmails({ domain: 'example.com' });

    expect(result.data.map((item) => item.id.email_id)).toEqual([
      'first',
      'last',
    ]);
    expect(result.pagination).toEqual({
      complete: true,
      pages: 3,
      items: 2,
      duplicates_removed: 0,
      next_cursor: null,
    });
    expect(mockClient.get).toHaveBeenCalledTimes(3);
  });

  it('rejects searches without a supported filter', async () => {
    await expect(emails.listEmailsPage({})).rejects.toThrow(
      'requires linked records'
    );
    expect(mockClient.get).not.toHaveBeenCalled();
  });
});
