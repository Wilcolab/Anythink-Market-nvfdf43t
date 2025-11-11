/**
 * chain_prompt.js
 *
 * toKebabCase - convert any string to standardized kebab-case.
 *
 * Compatible with Node.js and modern browsers.
 *
 * Usage:
 *   toKebabCase("Hello World") // "hello-world"
 *
 * Exports:
 *   - Node: module.exports = toKebabCase
 *   - Browser: window.toKebabCase = toKebabCase
 */

/* Simple implementation (illustrative):
function toKebabCase_simple(str) {
    return str.trim().replace(/\s+/g, '-').toLowerCase();
}
*/

/**
 * Robust implementation
 * - Validates input is a string
 * - Normalizes Unicode and removes diacritics (e.g. café -> cafe)
 * - Splits camelCase / PascalCase and acronym boundaries
 * - Replaces any non-letter/number runs with single hyphens
 * - Trims leading/trailing hyphens and lowercases result
 */
function toKebabCase(input) {
    if (typeof input !== 'string') {
        throw new TypeError('toKebabCase: input must be a string');
    }

    // Step 1: Trim whitespace
    let s = input.trim();

    // Step 2: Normalize Unicode to decompose accents, then remove combining marks
    // This converts characters like 'é' -> 'e' + combining mark, then strips the mark.
    // This helps produce ASCII-friendly kebab-case while still handling Unicode input.
    try {
        s = s.normalize('NFKD').replace(/\p{M}/gu, '');
    } catch (e) {
        // Older engines might not support Unicode property escapes; fallback to basic normalize
        s = s.normalize ? s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') : s;
    }

    // Step 3: Insert hyphens between camelCase / PascalCase boundaries:
    // - between a lowercase/number and an uppercase letter (fooBar -> foo-Bar)
    // - between an acronym and a regular word (XMLHttp -> XML-Http)
    // Use Unicode-aware classes where available.
    try {
        // Handle: ...lower/number + Upper...
        s = s.replace(/([\p{Ll}\p{Nd}])(\p{Lu})/gu, '$1-$2');
        // Handle: ...Acronym + UpperLower... (e.g., XMLHttp -> XML-Http)
        s = s.replace(/(\p{Lu}+)(\p{Lu}\p{Ll})/gu, '$1-$2');
    } catch (e) {
        // Fallback for environments without Unicode property escapes:
        s = s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2');
    }

    // Step 4: Replace any run of characters that are NOT letters or numbers with a single hyphen.
    // This collapses spaces, underscores, punctuation, and other delimiters.
    try {
        s = s.replace(/[^\p{L}\p{N}]+/gu, '-');
    } catch (e) {
        // Fallback for environments without Unicode property escapes:
        s = s.replace(/[^A-Za-z0-9]+/g, '-');
    }

    // Step 5: Collapse multiple hyphens (if any) and trim hyphens from ends, then lowercase.
    s = s.replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();

    return s;
}

/* Minimal test suite (5-7 cases) */
(function runTests() {
    const tests = [
        { in: 'Simple Test', out: 'simple-test' },
        { in: 'Mixed_delimiters - andSpaces', out: 'mixed-delimiters-and-spaces' },
        { in: 'fooBarBaz', out: 'foo-bar-baz' },
        { in: 'PascalCaseInputExample', out: 'pascal-case-input-example' },
        { in: '  multiple   spaces__and--delims!! ', out: 'multiple-spaces-and-delims' },
        { in: 'Unicode — naïve café 123', out: 'unicode-naive-cafe-123' },
    ];

    let passed = 0;
    for (const { in: input, out: expected } of tests) {
        let actual;
        try {
            actual = toKebabCase(input);
            const ok = actual === expected;
            console.log(`${ok ? '✔' : '✖'} Input: "${input}" -> "${actual}"${ok ? '' : ` (expected "${expected}")`}`);
            if (ok) passed++;
        } catch (err) {
            console.log(`✖ Input: "${input}" threw error: ${err}`);
        }
    }

    // Test invalid input handling
    let invalidPassed = false;
    try {
        toKebabCase(123);
    } catch (err) {
        invalidPassed = err instanceof TypeError;
        console.log(`${invalidPassed ? '✔' : '✖'} Invalid input correctly threw TypeError`);
    }

    const total = tests.length + 1;
    console.log(`\nSummary: ${passed + (invalidPassed ? 1 : 0)}/${total} tests passed.`);
})();

// Expose function for Node and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = toKebabCase;
} else if (typeof window !== 'undefined') {
    window.toKebabCase = toKebabCase;
}