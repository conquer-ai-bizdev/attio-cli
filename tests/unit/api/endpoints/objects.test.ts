import { describe, expect, it, vi } from 'vitest';
import { AttioClient } from '../../../../src/api/client';
import { ObjectEndpoints } from '../../../../src/api/endpoints/objects';

describe('ObjectEndpoints.listViewsPage', () => {
  it('lists saved object views through the documented endpoint', async () => {
    const response = {
      data: [
        {
          id: {
            workspace_id: '9780942b-3be5-4d62-b188-a0bd03da1aeb',
            object_id: '3885c8dd-2c92-4fba-bf49-059509408474',
            view_id: '34d434b3-b743-4167-88d1-7650ce543d6b',
          },
          title: '[!] Our of Sync',
          created_at: '2026-09-19T00:00:00.000Z',
        },
      ],
      pagination: { next_cursor: null },
    };
    const mockClient = {
      get: vi.fn().mockResolvedValue(response),
    } as unknown as AttioClient;
    const objects = new ObjectEndpoints(mockClient);

    await expect(objects.listViewsPage('companies')).resolves.toEqual(response);
    expect(mockClient.get).toHaveBeenCalledWith('/objects/companies/views', {
      limit: 500,
    });
  });
});
