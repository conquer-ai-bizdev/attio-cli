"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRecord = formatRecord;
exports.formatRecords = formatRecords;
exports.formatRecordSearchResponse = formatRecordSearchResponse;
exports.normalizeRecordWriteValues = normalizeRecordWriteValues;
exports.splitRecordUpdateValues = splitRecordUpdateValues;
exports.assertRequestedCurrencies = assertRequestedCurrencies;
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function nestedString(value, parent, child) {
    const nested = value[parent];
    if (!isObject(nested))
        return undefined;
    const candidate = nested[child];
    return typeof candidate === 'string' ? candidate : undefined;
}
function scalarValue(value) {
    if (Object.prototype.hasOwnProperty.call(value, 'value'))
        return value.value;
    const nested = nestedString(value, 'status', 'title') ??
        nestedString(value, 'option', 'title');
    if (nested !== undefined)
        return nested;
    for (const key of [
        'referenced_actor_id',
        'target_record_id',
        'currency_value',
        'domain',
        'email_address',
        'full_name',
    ]) {
        if (Object.prototype.hasOwnProperty.call(value, key))
            return value[key];
    }
    return undefined;
}
function formatAttributeValue(value) {
    if (!isObject(value))
        return value;
    const scalar = scalarValue(value);
    return scalar === undefined ? value : { ...value, value: scalar };
}
function formatRecord(record) {
    if (!isObject(record))
        return record;
    const id = isObject(record.id) ? record.id : undefined;
    const values = isObject(record.values) ? record.values : undefined;
    const formattedValues = values
        ? Object.fromEntries(Object.entries(values).map(([slug, entries]) => [
            slug,
            Array.isArray(entries) ? entries.map(formatAttributeValue) : entries,
        ]))
        : record.values;
    return {
        ...record,
        ...(typeof id?.record_id === 'string' ? { record_id: id.record_id } : {}),
        values: formattedValues,
    };
}
function formatRecords(records) {
    return records.map(formatRecord);
}
function formatRecordSearchResponse(response) {
    if (!isObject(response) || !Array.isArray(response.results))
        return response;
    const results = response.results;
    return {
        ...response,
        results: results.map((result) => {
            if (!isObject(result) || !isObject(result.attributes))
                return result;
            const values = Object.fromEntries(Object.entries(result.attributes).map(([slug, attribute]) => [
                slug,
                (Array.isArray(attribute)
                    ? attribute
                    : [attribute]).map((value) => ({ value })),
            ]));
            return { ...result, values };
        }),
    };
}
function normalizeRecordWriteValues(values) {
    if (!isObject(values))
        return { values, requestedCurrencies: {} };
    const requestedCurrencies = {};
    const normalized = Object.fromEntries(Object.entries(values).map(([slug, value]) => {
        if (!isObject(value))
            return [slug, value];
        const amount = typeof value.currency_value === 'number'
            ? value.currency_value
            : typeof value.value === 'number'
                ? value.value
                : undefined;
        const currency = typeof value.currency_code === 'string'
            ? value.currency_code
            : undefined;
        if (amount === undefined || currency === undefined)
            return [slug, value];
        requestedCurrencies[slug] = currency;
        return [slug, { currency_value: amount }];
    }));
    return { values: normalized, requestedCurrencies };
}
function splitRecordUpdateValues(values) {
    if (!isObject(values))
        return { clearValues: {}, writeValues: values };
    const clearValues = {};
    const writeEntries = [];
    for (const [slug, value] of Object.entries(values)) {
        if (value === null)
            clearValues[slug] = [];
        else
            writeEntries.push([slug, value]);
    }
    return {
        clearValues,
        writeValues: Object.fromEntries(writeEntries),
    };
}
function assertRequestedCurrencies(record, requestedCurrencies) {
    if (Object.keys(requestedCurrencies).length === 0)
        return;
    if (!isObject(record) || !isObject(record.values)) {
        throw new Error('Attio did not return record values for currency validation.');
    }
    for (const [slug, expected] of Object.entries(requestedCurrencies)) {
        const entries = record.values[slug];
        const actual = Array.isArray(entries) && isObject(entries[0])
            ? entries[0].currency_code
            : undefined;
        if (actual !== expected) {
            throw new Error(`Attio stored currency ${String(actual)} for field "${slug}", but the input requested ${expected}.`);
        }
    }
}
//# sourceMappingURL=record.js.map