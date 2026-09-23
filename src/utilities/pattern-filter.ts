export type PatternFilterOptions = {
    ignoreCase?: boolean;
    matchRegex?: boolean;
};

/**
 * Normalizes a raw pattern string from CLI input.
 *
 * It strips leading '=' characters and surrounding quotes so patterns like
 * "=foo*", "'foo*'" or '"foo*"' all become "foo*".
 *
 * @example
 * normalizePatternInput("=app*") // => "app*"
 * normalizePatternInput("'demo*'") // => "demo*"
 * normalizePatternInput('"*frontend"') // => "*frontend"
 */
export function normalizePatternInput(p: string | undefined | null): string {
    if (p === undefined || p === null) {
        return '';
    }

    let s = String(p)
        .trim()
        .replace(/^=+/, '')
        .trim();

    if (
        (s.startsWith("'") && s.endsWith("'")) ||
        (s.startsWith('"') && s.endsWith('"'))
    ) {
        s = s.slice(1, -1).trim();
    }

    return s;
}

/**
 * Converts a single pattern or an array of patterns into a normalized list.
 *
 * @param value - Pattern string, array of pattern strings, or undefined.
 * @returns A list of normalized patterns with empty values removed.
 *
 * @example
 * coercePatternList("app*") // => ["app*"]
 * coercePatternList(["app*", "=demo*"]) // => ["app*", "demo*"]
 */
export function coercePatternList(value: string | string[] | undefined): string[] {
    if (Array.isArray(value)) {
        return value.map(normalizePatternInput).filter(Boolean);
    }

    if (value) {
        return [normalizePatternInput(value)].filter(Boolean);
    }

    return [];
}

/**
 * Converts a wildcard pattern such as "app*" or "*demo*" into a regular expression.
 *
 * Only "*" is treated as a wildcard. All other characters are escaped as literals.
 *
 * @param pattern - The wildcard pattern to convert.
 * @param ignoreCase - Whether matching should be case-insensitive.
 * @returns A regex that matches the wildcard pattern.
 *
 * @example
 * wildcardToRegex("app*") // => /^app.*$/
 * wildcardToRegex("*frontend*", true) // => /^.*frontend.*$/i
 */
export function wildcardToRegex(pattern: string, ignoreCase = false): RegExp {
    const escaped = pattern
        .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '.*');

    return new RegExp(`^${escaped}$`, ignoreCase ? 'i' : undefined);
}

/**
 * Converts either a wildcard pattern or a raw regex into a regex instance.
 *
 * @param pattern - The pattern to compile.
 * @param options - Matching options.
 * @returns A compiled regular expression.
 *
 * @example
 * patternToRegex("app*") // => /^app.*$/
 * patternToRegex("^demo.*$", { matchRegex: true }) // => /^demo.*$/
 * patternToRegex("*frontend*", { ignoreCase: true }) // => /^.*frontend.*$/i
 */
export function patternToRegex(
    pattern: string,
    options: PatternFilterOptions = {}
): RegExp {
    const { ignoreCase = false, matchRegex = false } = options;

    if (matchRegex) {
        try {
            return new RegExp(pattern, ignoreCase ? 'i' : undefined);
        } catch {
            const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
            return new RegExp(`^${escaped}$`, ignoreCase ? 'i' : undefined);
        }
    }

    return wildcardToRegex(pattern, ignoreCase);
}

/**
 * Checks whether a value matches any of the provided patterns.
 *
 * @param value - The input string to test.
 * @param patterns - The allowed patterns to match against.
 * @param options - Matching behavior.
 * @returns True when the value matches at least one pattern.
 *
 * @example
 * matchesAnyPattern("my-app-backend", ["my-app*"]) // => true
 * matchesAnyPattern("My-App", ["my-app*"], { ignoreCase: true }) // => true
 */
export function matchesAnyPattern(
    value: string,
    patterns: readonly string[],
    options: PatternFilterOptions = {}
): boolean {
    return patterns.some(pattern => {
        const normalizedPattern = normalizePatternInput(pattern);

        if (!normalizedPattern) {
            return false;
        }

        return patternToRegex(normalizedPattern, options).test(value);
    });
}

/**
 * Filters a list of items by include and exclude patterns based on a string name.
 *
 * Match behavior:
 * - If matchPatterns is empty, all items are included.
 * - If an item matches any include pattern, it is accepted.
 * - If it matches any exclude pattern, it is rejected even if it also matches include.
 *
 * @param items - The array of items to filter.
 * @param getItemName - Function that extracts the string name used for matching.
 * @param matchPatterns - Patterns that should be accepted.
 * @param excludePatterns - Patterns that should be rejected.
 * @param options - Matching behavior such as ignoreCase or raw regex mode.
 * @returns A filtered array containing only matching, non-excluded items.
 *
 * @example
 * filterByPatterns(
 *   ["app-backend", "legacy-ui", "app-frontend"],
 *   v => v,
 *   ["app-*"],
 *   ["*legacy*"]
 * ) // => ["app-backend", "app-frontend"]
 *
 * @example
 * filterByPatterns(
 *   ["App-Backend", "demo-api"],
 *   v => v,
 *   ["app-*"],
 *   [],
 *   { ignoreCase: true }
 * ) // => ["App-Backend"]
 */
export function filterByPatterns<T>(
    items: T[],
    getItemName: (item: T) => string,
    matchPatterns: string[] = [],
    excludePatterns: string[] = [],
    options: PatternFilterOptions = {}
): T[] {
    const normalizedMatch = matchPatterns.map(normalizePatternInput).filter(Boolean);
    const normalizedExclude = excludePatterns.map(normalizePatternInput).filter(Boolean);

    return items.filter(item => {
        const name = getItemName(item);

        const isMatch =
            normalizedMatch.length === 0 ||
            matchesAnyPattern(name, normalizedMatch, options);

        const isExcluded =
            normalizedExclude.length > 0 &&
            matchesAnyPattern(name, normalizedExclude, options);

        return isMatch && !isExcluded;
    });
}
