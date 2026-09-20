import { describe, expect, it } from 'vitest';
import {
  assertRequestedCurrencies,
  formatRecord,
  formatRecordSearchResponse,
  normalizeRecordWriteValues,
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

describe('record write formatting', () => {
  it('accepts the output-shaped currency value', () => {
    expect(
      normalizeRecordWriteValues({
        value: { value: 180000, currency_code: 'USD' },
      })
    ).toEqual({
      values: { value: { currency_value: 180000 } },
      requestedCurrencies: { value: 'USD' },
    });
  });

  it('rejects a stored currency that differs from the request', () => {
    expect(() =>
      assertRequestedCurrencies(
        { values: { value: [{ currency_code: 'GBP' }] } },
        { value: 'USD' }
      )
    ).toThrow('Attio stored currency GBP');
  });
});
