# safe-validate-json-schema

[![npm version](https://img.shields.io/npm/v/safe-validate-json-schema.svg)](https://www.npmjs.com/package/safe-validate-json-schema)
[![license](https://img.shields.io/github/license/venisha-kalola/safe-validate-json-schema.svg)](https://github.com/venisha-kalola/safe-validate-json-schema/blob/main/LICENSE)

Tiny, safe JSON Schema validator that returns clear, human-friendly errors.

Install
- npm: npm install safe-validate-json-schema
- yarn: yarn add safe-validate-json-schema
- npx: npx safe-validate-json-schema --schema schema.json --data data.json

Usage (programmatic)
```js
import { validateWithFriendlyErrors } from 'safe-validate-json-schema';

const schema = { type: 'object', required: ['name'], properties: { name: { type: 'string' } } };
const data = { name: 123 };

const { valid, errors } = validateWithFriendlyErrors(schema, data);
if (!valid) console.error(errors); // friendly error messages
