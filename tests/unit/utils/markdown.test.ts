import { describe, expect, it } from 'vitest';
import { markdownLinesMatch } from '../../../src/utils/markdown';

describe('markdownLinesMatch', () => {
  it('accepts Attio blank-line and trailing-space normalization', () => {
    expect(
      markdownLinesMatch(
        '## Current position\n\nText  \n\n- item\n  - detail\n',
        '## Current position\nText\n- item\n  - detail'
      )
    ).toBe(true);
  });

  it('rejects missing, reordered, or changed content', () => {
    expect(markdownLinesMatch('one\ntwo', 'one')).toBe(false);
    expect(markdownLinesMatch('one\ntwo', 'two\none')).toBe(false);
    expect(markdownLinesMatch('one\ntwo', 'one\nthree')).toBe(false);
  });
});
