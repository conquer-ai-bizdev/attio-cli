import { describe, expect, it } from 'vitest';
import {
  formatRecord,
  formatRecordSearchResponse,
} from '../../../src/formatters/record';

describe('record formatters', () => {
  it('adds stable record and attribute values without removing raw fields', () => {
    expect(
      formatRecord({
        id: { record_id: 'deal-1' },
        values: {
          amount: [{ currency_code: 'USD', currency_value: 150000 }],
          stage: [{ status: { title: 'Intro call' } }],
        },
      })
    ).toEqual({
      id: { record_id: 'deal-1' },
      record_id: 'deal-1',
      values: {
        amount: [
          { currency_code: 'USD', currency_value: 150000, value: 150000 },
        ],
        stage: [{ status: { title: 'Intro call' }, value: 'Intro call' }],
      },
    });
  });

  it('adds record-shaped values to compact search results', () => {
    expect(
      formatRecordSearchResponse({
        has_more_results: false,
        results: [
          {
            record_id: 'company-1',
            attributes: {
              domains: ['example.com'],
              name: 'Example',
              team: [{ object_slug: 'people', record_id: 'person-1' }],
            },
          },
        ],
      })
    ).toEqual({
      has_more_results: false,
      results: [
        {
          record_id: 'company-1',
          attributes: {
            domains: ['example.com'],
            name: 'Example',
            team: [{ object_slug: 'people', record_id: 'person-1' }],
          },
          values: {
            domains: [{ value: 'example.com' }],
            name: [{ value: 'Example' }],
            team: [{ value: { object_slug: 'people', record_id: 'person-1' } }],
          },
        },
      ],
    });
  });
});
