#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { validateWithFriendlyErrors } from './validate';

function readJson(filename?: string): any {
  if (!filename || filename === '-') {
    const input = fs.readFileSync(0, 'utf-8');
    return JSON.parse(input);
  }
  const file = fs.readFileSync(path.resolve(process.cwd(), filename), 'utf-8');
    return JSON.parse(file);
}

const argv = minimist(process.argv.slice(2), { string: ['schema', 'data'], alias: { s: 'schema', d: 'data' }, default: { data: '-' } });

if (!argv.schema) {
  console.error('Usage: safe-validate-json-schema --schema schema.json [--data data.json]');
  process.exit(2);
}

try {
  const schema = readJson(argv.schema);
  const data = readJson(argv.data);
  const res = validateWithFriendlyErrors(schema, data);
  if (res.valid) {
    console.log('VALID');
    process.exit(0);
  } else {
    console.error('INVALID');
    console.error(JSON.stringify(res.errors, null, 2));
    process.exit(1);
  }
} catch (e: any) {
  console.error('Error:', e.message || e);
  process.exit(3);
}