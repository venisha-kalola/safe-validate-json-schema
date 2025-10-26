```markdown
# safe-validate-json-schema

[![npm version](https://img.shields.io/npm/v/safe-validate-json-schema.svg)](https://www.npmjs.com/package/safe-validate-json-schema)
[![license](https://img.shields.io/npm/l/safe-validate-json-schema.svg)](https://github.com/venisha-kalola/safe-validate-json-schema/blob/main/LICENSE)

A safe, user-friendly JSON Schema validator that returns helpful, human-readable error messages suitable for both programmatic use and CLI workflows.

Why use this package?
- Clear, friendly validation errors that are easy to read and act on.
- Simple programmatic API for Node.js applications and scripts.
- Minimal friction for CLI usage (validate files quickly from the terminal).
- Safe defaults to avoid surprising behaviour when validating untrusted input.

## Contents

- Features
- Installation
- Usage (programmatic)
  - JavaScript
  - TypeScript
  - Return shape & example
- Usage (CLI)
- Exit codes
- Examples
- Contributing
- License & security

## Features

- Lightweight and easy to integrate
- Produces descriptive and actionable error messages
- Works well in CI, scripts, and developer tooling
- Suitable for validating user-supplied JSON safely

## Install

Install as a development or production dependency:

```bash
# npm
npm install safe-validate-json-schema

# or yarn
yarn add safe-validate-json-schema
```

You can also run it without installing using npx:

```bash
npx safe-validate-json-schema --schema schema.json --data data.json
```

## Usage (programmatic)

Import and call the helper to validate data against a JSON Schema.

JavaScript (CommonJS):

```js
const { validateWithFriendlyErrors } = require('safe-validate-json-schema');

const schema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  additionalProperties: false
};

const data = { name: 123, extra: true };

const res = validateWithFriendlyErrors(schema, data);

if (!res.valid) {
  console.error('Validation failed:');
  console.error(res.errors); // friendly error objects or messages
} else {
  console.log('Valid!');
}
```

TypeScript / ESM:

```ts
import { validateWithFriendlyErrors } from 'safe-validate-json-schema';

const schema = { /* ... */ } as const;
const data = { /* ... */ };

const res = validateWithFriendlyErrors(schema, data);

if (!res.valid) {
  // res.errors -> array of friendly error objects
  console.log(res.errors);
}
```

Return shape (typical)
- valid: boolean — true when data passes the schema
- errors: array — zero or more friendly error objects when validation fails

A friendly error object usually contains:
- message: human readable message (string)
- instancePath / path: JSON Pointer or property path indicating where the error occurred
- keyword (optional): the failing JSON Schema keyword (e.g., "type", "required")
- suggestion (optional): short hint to fix the error

Example returned object:

```json
{
  "valid": false,
  "errors": [
    {
      "message": "Property 'name' must be a string but received number",
      "path": "/name",
      "keyword": "type",
      "suggestion": "Convert name to a string, e.g. 'name': 'Alice'."
    },
    {
      "message": "Property 'extra' is not allowed by the schema",
      "path": "/extra",
      "keyword": "additionalProperties"
    }
  ]
}
```

Note: Exact fields may vary depending on version. Use the message and path fields for user-facing output.

## Usage (CLI)

Basic usage:

```bash
safe-validate-json-schema --schema schema.json --data data.json
```

Common options:
- --schema <file>   Path to the JSON Schema file
- --data <file>     Path to the JSON data file to validate
- --help            Show usage information
- --version         Show package version

You can also use stdin for the data file:

```bash
cat data.json | safe-validate-json-schema --schema schema.json
```

Output: the CLI prints friendly validation results to stdout/stderr. When validation fails it prints the friendly errors; when successful it prints a success message or exits quietly based on flags.

## Exit codes

The CLI follows standard conventions:
- 0 — validation succeeded
- non-zero — validation failed or an error occurred (invalid input, parsing error, missing file, etc.)

This behaviour makes it suitable for CI checks and scripts.

## Examples

Validate a schema in a GitHub Action, CI job, or npm script:

```bash
# Run validation as part of a check script
safe-validate-json-schema --schema ./schema.json --data ./fixtures/sample.json || exit 1
```

Programmatically validate and transform errors for display:

```js
const { validateWithFriendlyErrors } = require('safe-validate-json-schema');

const { valid, errors } = validateWithFriendlyErrors(schema, data);

if (!valid) {
  // Format for CLI or web UI
  errors.forEach(err => {
    console.error(`${err.path || '<root>'}: ${err.message}`);
  });
}
```

## Contributing

Contributions, issues and feature requests are welcome!

- Open an issue describing your change or bug
- Fork the repo, create a feature branch, write tests and open a pull request
- Keep changes small and focused; update README and add examples when adding features

If you are submitting a security issue, please follow responsible disclosure — see the repository's SECURITY.md (if present) or open a private issue.

## Testing

Include tests in this repo (if any) and run them with:

```bash
npm test
# or
yarn test
```

## Versioning & Releases

This package follows semantic versioning. Breaking changes will increment the major version.

## License

This project is licensed under the terms in the LICENSE file in the repository root.

## Contact & Support

For usage questions or to report bugs, please open an issue in this repository: https://github.com/venisha-kalola/safe-validate-json-schema/issues

```
