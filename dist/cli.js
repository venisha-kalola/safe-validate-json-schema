#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const minimist_1 = __importDefault(require("minimist"));
const validate_1 = require("./validate");
function readJson(filename) {
    if (!filename || filename === '-') {
        const input = fs_1.default.readFileSync(0, 'utf-8');
        return JSON.parse(input);
    }
    const file = fs_1.default.readFileSync(path_1.default.resolve(process.cwd(), filename), 'utf-8');
    return JSON.parse(file);
}
const argv = (0, minimist_1.default)(process.argv.slice(2), { string: ['schema', 'data'], alias: { s: 'schema', d: 'data' }, default: { data: '-' } });
if (!argv.schema) {
    console.error('Usage: safe-validate-json-schema --schema schema.json [--data data.json]');
    process.exit(2);
}
try {
    const schema = readJson(argv.schema);
    const data = readJson(argv.data);
    const res = (0, validate_1.validateWithFriendlyErrors)(schema, data);
    if (res.valid) {
        console.log('VALID');
        process.exit(0);
    }
    else {
        console.error('INVALID');
        console.error(JSON.stringify(res.errors, null, 2));
        process.exit(1);
    }
}
catch (e) {
    console.error('Error:', e.message || e);
    process.exit(3);
}
