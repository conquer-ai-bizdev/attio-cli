export interface FilterValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Recursively checks if an object contains any operator (key starting with $)
 */
function hasOperatorRecursive(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const keys = Object.keys(obj as object);

  // Check if any key starts with $
  if (keys.some((key) => key.startsWith('$'))) {
    return true;
  }

  // Recursively check nested objects
  for (const value of Object.values(obj as object)) {
    if (hasOperatorRecursive(value)) {
      return true;
    }
  }

  return false;
}

/**
 * Validates basic filter structure (not exhaustive)
 */
export function validateFilterStructure(
  filter: unknown
): FilterValidationResult {
  const errors: string[] = [];

  if (typeof filter !== 'object' || filter === null) {
    errors.push('Filter must be an object');
    return { valid: false, errors };
  }

  // Check for common mistakes
  const filterObj = filter as Record<string, unknown>;

  for (const [attributeSlug, attributeFilter] of Object.entries(filterObj)) {
    if (typeof attributeFilter !== 'object' || attributeFilter === null) {
      errors.push(`Filter for attribute "${attributeSlug}" must be an object`);
      continue;
    }

    // Check if it has any filter operators (recursively)
    const hasOperator = hasOperatorRecursive(attributeFilter);

    if (!hasOperator) {
      errors.push(
        `Filter for "${attributeSlug}" must contain an operator like $eq, $contains, $starts_with, or $ends_with`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
