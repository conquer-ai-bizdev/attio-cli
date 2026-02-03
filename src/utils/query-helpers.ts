/**
 * Query filter operators supported by Attio API
 */
export const FILTER_OPERATORS = {
  $eq: 'Equals',
  $contains: 'Contains substring',
  $starts_with: 'Starts with',
  $ends_with: 'Ends with',
} as const;

/**
 * Build a simple equality filter for an attribute
 *
 * @example
 * filterByAttribute('email_addresses', { email_address: { $eq: 'user@example.com' } })
 */
export function filterByAttribute(
  attributeSlug: string,
  value: Record<string, unknown>
): Record<string, unknown> {
  return {
    [attributeSlug]: value,
  };
}

/**
 * Build a contains filter for text attributes
 *
 * @example
 * filterContains('email_addresses', 'email_address', '@example.com')
 * // Returns: { email_addresses: { email_address: { $contains: '@example.com' } } }
 */
export function filterContains(
  attributeSlug: string,
  nestedField: string,
  searchText: string
): Record<string, unknown> {
  return {
    [attributeSlug]: {
      [nestedField]: {
        $contains: searchText,
      },
    },
  };
}

/**
 * Build an equality filter for nested attributes
 *
 * @example
 * filterEquals('name', 'first_name', 'John')
 * // Returns: { name: { first_name: { $eq: 'John' } } }
 */
export function filterEquals(
  attributeSlug: string,
  nestedField: string,
  value: unknown
): Record<string, unknown> {
  return {
    [attributeSlug]: {
      [nestedField]: {
        $eq: value,
      },
    },
  };
}

/**
 * Example filters for common use cases
 *
 * These examples show how to construct filters for both standard
 * and custom attributes. Custom attributes work the same way as
 * standard attributes - just use the attribute slug.
 */
export const EXAMPLE_FILTERS = {
  // Filter people by email domain
  people_by_email_domain: {
    email_addresses: {
      email_address: {
        $contains: '@example.com',
      },
    },
  },

  // Filter people by exact email
  people_by_exact_email: {
    email_addresses: {
      email_address: {
        $eq: 'user@example.com',
      },
    },
  },

  // Filter people by company (record reference)
  people_by_company: {
    company: {
      target_record_id: {
        $eq: '<company-record-id>',
      },
    },
  },

  // Filter by custom attribute (unknown at compile time)
  // Replace 'custom_status_field' with your actual attribute slug
  people_by_custom_status: {
    custom_status_field: {
      $eq: 'active',
    },
  },

  // Filter by custom text attribute with contains
  people_by_custom_text_contains: {
    custom_notes_field: {
      $contains: 'important',
    },
  },

  // Filter companies by domain
  companies_by_domain: {
    domains: {
      domain: {
        $eq: 'example.com',
      },
    },
  },
};

/**
 * Example sort specifications
 */
export const EXAMPLE_SORTS = {
  // Sort by creation date, newest first
  newest_first: [{ attribute: 'created_at', direction: 'desc' as const }],

  // Sort by creation date, oldest first
  oldest_first: [{ attribute: 'created_at', direction: 'asc' as const }],

  // Sort by name (for objects that have a name attribute)
  by_name_asc: [{ attribute: 'name', direction: 'asc' as const }],
};
