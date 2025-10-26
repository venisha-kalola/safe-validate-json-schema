# safe-validate-json-schema

Validate JSON against a JSON Schema and get **human-friendly**, prioritized fix suggestions.

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
