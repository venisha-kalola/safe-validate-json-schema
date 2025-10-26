# safe-validate-json-schema

[![npm version](https://img.shields.io/npm/v/safe-validate-json-schema.svg)](https://www.npmjs.com/package/safe-validate-json-schema)
[![license](https://img.shields.io/npm/l/safe-validate-json-schema.svg)](https://github.com/venisha-kalola/safe-validate-json-schema/blob/main/LICENSE)

A safe and user-friendly JSON Schema validator with helpful error messages.

## Install

```bash
npm i -D safe-validate-json-schema
# or globally
npm i -g safe-validate-json-schema
```

## Usage (programmatic)

```ts
import { validateWithFriendlyErrors } from 'safe-validate-json-schema';

const schema = { type: 'object', required: ['name'], properties: { name: { type: 'string' }, age: { type: 'number' } } };
const data = { name: 123, extra: true };

const res = validateWithFriendlyErrors(schema, data);
if (!res.valid) console.log(res.errors);
```

## Usage (CLI)

```bash
safe-validate-json-schema --schema schema.json --data data.json
```
