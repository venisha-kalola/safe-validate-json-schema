import { describe, it, expect } from 'vitest';
import { validateWithFriendlyErrors } from '../src/validate';

describe('validateWithFriendlyErrors', () => {
  it('validates correct data', () => {
    const schema = { type: 'object', properties: { x: { type: 'number' } } };
    const data = { x: 5 };
    const res = validateWithFriendlyErrors(schema, data);
    expect(res.valid).toBe(true);
  });

  it('detects missing property', () => {
    const schema = { type: 'object', required: ['name'], properties: { name: { type: 'string' } } };
    const data = {};
    const res = validateWithFriendlyErrors(schema, data);
    expect(res.valid).toBe(false);
    expect(res.errors[0].message).toContain('Missing required property');
  });
});