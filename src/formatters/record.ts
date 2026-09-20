type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nestedString(
  value: JsonObject,
  parent: string,
  child: string
): string | undefined {
  const nested = value[parent];
  if (!isObject(nested)) return undefined;
  const candidate = nested[child];
  return typeof candidate === 'string' ? candidate : undefined;
}

function scalarValue(value: JsonObject): unknown {
  if (Object.prototype.hasOwnProperty.call(value, 'value')) return value.value;

  const nested =
    nestedString(value, 'status', 'title') ??
    nestedString(value, 'option', 'title');
  if (nested !== undefined) return nested;

  for (const key of [
    'referenced_actor_id',
    'target_record_id',
    'currency_value',
    'domain',
    'email_address',
    'full_name',
  ]) {
    if (Object.prototype.hasOwnProperty.call(value, key)) return value[key];
  }

  return undefined;
}

function formatAttributeValue(value: unknown): unknown {
  if (!isObject(value)) return value;
  const scalar = scalarValue(value);
  return scalar === undefined ? value : { ...value, value: scalar };
}

export function formatRecord(record: unknown): unknown {
  if (!isObject(record)) return record;

  const id = isObject(record.id) ? record.id : undefined;
  const values = isObject(record.values) ? record.values : undefined;
  const formattedValues = values
    ? Object.fromEntries(
        Object.entries(values).map(([slug, entries]) => [
          slug,
          Array.isArray(entries) ? entries.map(formatAttributeValue) : entries,
        ])
      )
    : record.values;

  return {
    ...record,
    ...(typeof id?.record_id === 'string' ? { record_id: id.record_id } : {}),
    values: formattedValues,
  };
}

export function formatRecords(records: unknown[]): unknown[] {
  return records.map(formatRecord);
}
