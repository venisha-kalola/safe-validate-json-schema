"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWithFriendlyErrors = validateWithFriendlyErrors;
const ajv_1 = __importDefault(require("ajv"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
const ajv = new ajv_1.default({ allErrors: true, strict: false });
(0, ajv_formats_1.default)(ajv);
function inferType(value) {
    if (value === null)
        return 'null';
    if (Array.isArray(value))
        return 'array';
    return typeof value;
}
function maskSensitive(value) {
    if (typeof value === 'string') {
        if (value.length > 40 || /password|secret|token|api[_-]?key/i.test(value)) {
            return value.slice(0, 6) + '…' + value.slice(-4);
        }
    }
    return value;
}
function prettifyPath(instancePath) {
    return instancePath || '/';
}
function summarizeAjvError(err) {
    const path = prettifyPath(err.instancePath || '');
    const keyword = err.keyword;
    const params = err.params || {};
    let message = err.message || 'Invalid value';
    let suggestion;
    let expected;
    let received;
    if (keyword === 'type') {
        expected = Array.isArray(params.type) ? params.type.join(' | ') : String(params.type);
        if ('data' in err)
            received = typeof err.data;
        suggestion = `Change type to ${expected}`;
    }
    else if (keyword === 'required') {
        const missing = params.missingProperty;
        message = `Missing required property '${missing}'`;
        suggestion = `Add property '${missing}' to ${path || '/'} with appropriate value`;
    }
    else if (keyword === 'additionalProperties') {
        const prop = params.additionalProperty;
        message = `Unexpected property '${prop}'`;
        suggestion = `Remove '${prop}' from ${path || '/'} or update the schema to allow it`;
    }
    else if (keyword === 'format') {
        const fmt = params.format;
        suggestion = `Ensure the value matches ${fmt} format`;
    }
    const sample = err.data !== undefined ? maskSensitive(err.data) : undefined;
    const humanMessage = `${message}${sample !== undefined ? ` — example: ${JSON.stringify(sample)}` : ''}`;
    return { path, message: humanMessage, keyword, suggestion, expected, received };
}
function validateWithFriendlyErrors(schema, data) {
    const validate = ajv.compile(schema);
    const valid = validate(data);
    if (valid)
        return { valid: true, errors: [] };
    const errors = (validate.errors || []).map(summarizeAjvError);
    return { valid: false, errors };
}
