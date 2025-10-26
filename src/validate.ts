import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

export type FriendlyError = {
  path: string;
  message: string;
  keyword?: string;
  suggestion?: string;
  received?: string;
  expected?: string;
};

export type ValidationResult = { valid: boolean; errors: FriendlyError[] };

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function inferType(value: any): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function maskSensitive(value: any): any {
  if (typeof value === 'string') {
    if (value.length > 40 || /password|secret|token|api[_-]?key/i.test(value)) {
      return value.slice(0, 6) + '…' + value.slice(-4);
    }
  }
  return value;
}

function prettifyPath(instancePath: string): string {
  return instancePath || '/';
}

function summarizeAjvError(err: ErrorObject): FriendlyError {
  const path = prettifyPath(err.instancePath || '');
  const keyword = err.keyword;
  const params = err.params || {};
  let message = err.message || 'Invalid value';
  let suggestion: string | undefined;
  let expected: string | undefined;
  let received: string | undefined;

  if (keyword === 'type') {
    expected = Array.isArray(params.type) ? params.type.join(' | ') : String(params.type);
    if ('data' in err) received = typeof (err as any).data;
    suggestion = `Change type to ${expected}`;
  } else if (keyword === 'required') {
    const missing = (params as any).missingProperty;
    message = `Missing required property '${missing}'`;
    suggestion = `Add property '${missing}' to ${path || '/'} with appropriate value`;
  } else if (keyword === 'additionalProperties') {
    const prop = (params as any).additionalProperty;
    message = `Unexpected property '${prop}'`;
    suggestion = `Remove '${prop}' from ${path || '/'} or update the schema to allow it`;
  } else if (keyword === 'format') {
    const fmt = (params as any).format;
    suggestion = `Ensure the value matches ${fmt} format`;
  }

  const sample = (err as any).data !== undefined ? maskSensitive((err as any).data) : undefined;
  const humanMessage = `${message}${sample !== undefined ? ` — example: ${JSON.stringify(sample)}` : ''}`;

  return { path, message: humanMessage, keyword, suggestion, expected, received };
}

export function validateWithFriendlyErrors(schema: object, data: any): ValidationResult {
  const validate = ajv.compile(schema as any);
  const valid = validate(data) as boolean;
  if (valid) return { valid: true, errors: [] };

  const errors = (validate.errors || []).map(summarizeAjvError);
  return { valid: false, errors };
}