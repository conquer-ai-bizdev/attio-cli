"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatRecord = formatRecord;
exports.formatRecords = formatRecords;
exports.formatRecordSearchResponse = formatRecordSearchResponse;
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
//# sourceMappingURL=record.js.map