/**
 * Query filter operators supported by Attio API
 */
export declare const FILTER_OPERATORS: {
    readonly $eq: "Equals";
    readonly $contains: "Contains substring";
    readonly $starts_with: "Starts with";
    readonly $ends_with: "Ends with";
};
/**
 * Build a simple equality filter for an attribute
 *
 * @example
 * filterByAttribute('email_addresses', { email_address: { $eq: 'user@example.com' } })
 */
export declare function filterByAttribute(attributeSlug: string, value: Record<string, unknown>): Record<string, unknown>;
/**
 * Build a contains filter for text attributes
 *
 * @example
 * filterContains('email_addresses', 'email_address', '@example.com')
 * // Returns: { email_addresses: { email_address: { $contains: '@example.com' } } }
 */
export declare function filterContains(attributeSlug: string, nestedField: string, searchText: string): Record<string, unknown>;
/**
 * Build an equality filter for nested attributes
 *
 * @example
 * filterEquals('name', 'first_name', 'John')
 * // Returns: { name: { first_name: { $eq: 'John' } } }
 */
export declare function filterEquals(attributeSlug: string, nestedField: string, value: unknown): Record<string, unknown>;
/**
 * Example filters for common use cases
 *
 * These examples show how to construct filters for both standard
 * and custom attributes. Custom attributes work the same way as
 * standard attributes - just use the attribute slug.
 */
export declare const EXAMPLE_FILTERS: {
    people_by_email_domain: {
        email_addresses: {
            email_address: {
                $contains: string;
            };
        };
    };
    people_by_exact_email: {
        email_addresses: {
            email_address: {
                $eq: string;
            };
        };
    };
    people_by_company: {
        company: {
            target_record_id: {
                $eq: string;
            };
        };
    };
    people_by_custom_status: {
        custom_status_field: {
            $eq: string;
        };
    };
    people_by_custom_text_contains: {
        custom_notes_field: {
            $contains: string;
        };
    };
    companies_by_domain: {
        domains: {
            domain: {
                $eq: string;
            };
        };
    };
};
/**
 * Example sort specifications
 */
export declare const EXAMPLE_SORTS: {
    newest_first: {
        attribute: string;
        direction: "desc";
    }[];
    oldest_first: {
        attribute: string;
        direction: "asc";
    }[];
    by_name_asc: {
        attribute: string;
        direction: "asc";
    }[];
};
//# sourceMappingURL=query-helpers.d.ts.map