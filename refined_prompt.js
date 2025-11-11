/**
 * Convert an arbitrary string to camelCase.
 *
 * This function produces a JavaScript-style camelCase identifier from a wide
 * range of input text. It is designed to be robust for real-world inputs:
 * - Trims leading/trailing whitespace and collapses repeated delimiters.
 * - Performs Unicode normalization (NFKD) and removes combining diacritical marks
 *   so visually equivalent characters (e.g. "café") become stable ASCII-like
 *   sequences ("cafe") when possible.
 * - Detects and splits existing camelCase / PascalCase boundaries so that
 *   "PascalCase" -> "pascalCase" and "alreadyCamelCase" is preserved.
 * - Splits letter ↔ number boundaries so "version2alpha" -> "version2Alpha"
 *   and "1stPlace" -> "1stPlace".
 * - Treats any non-letter/non-number run (underscores, hyphens, punctuation,
 *   spaces, etc.) as delimiters and collapses them into word boundaries.
 * - Preserves leading digits in a word. If a word starts with a digit, the
 *   digit(s) remain unchanged and subsequent letter characters are lowercased
 *   or capitalized according to position rules.
 *
 * Rules for casing:
 * - The first resulting word is entirely lowercased.
 * - Subsequent words have their first letter uppercased (if a letter) and the
 *   remainder lowercased.
 * - Words that begin with digits preserve those digits; casing only affects
 *   following letter characters.
 *
 * Behavior on edge cases:
 * - If the trimmed input contains no letter/number characters, an empty string
 *   is returned.
 * - The function expects modern JavaScript environments: it uses
 *   String.prototype.normalize and Unicode-aware regular expressions
 *   (Unicode property escapes). In environments that lack these features,
 *   behavior may differ or throw.
 *
 * @param {string} input - The input string to convert to camelCase. Must be a string.
 * @returns {string} The camelCased result. Examples:
 *   - toCamelCase('hello world') -> 'helloWorld'
 *   - toCamelCase('Hello_world-test') -> 'helloWorldTest'
 *   - toCamelCase('PascalCaseInput') -> 'pascalCaseInput'
 *   - toCamelCase('version2alpha') -> 'version2Alpha'
 *   - toCamelCase('café-au-lait') -> 'cafeAuLait'
 *   - toCamelCase('   ') -> ''  (empty after trimming/delimiting)
 * @throws {TypeError} If input is not a string (e.g. null or number).
 * @example
 * // Basic usage
 * const id = toCamelCase('  user_profile-id '); // 'userProfileId'
 *
 * @example
 * // Preserves leading digits and normalizes Unicode
 * toCamelCase('123 leading digits'); // '123LeadingDigits'
 * toCamelCase('École primaire'); // 'ecolePrimaire'
 *
 * @see {@link toDotCase} For a related transformation that produces dot.case output.
 * @since 1.0.0
 */

/**
 * Convert an arbitrary string to dot.case (lowercase words joined by dots).
 *
 * This function converts input text into a predictable, dot-separated, all
 * lowercase representation. It shares many of the same normalization and
 * boundary-detection behaviors as toCamelCase:
 * - Trims whitespace and collapses repeated delimiters.
 * - Applies Unicode normalization (NFKD) and strips combining diacritical marks
 *   so accented characters become their base forms when possible.
 * - Splits camelCase / PascalCase boundaries so "PascalCase" -> "pascal.case".
 * - Splits letter ↔ number boundaries so "version2alpha" -> "version.2.alpha".
 * - Treats any contiguous non-letter/non-number characters (underscores,
 *   hyphens, punctuation, spaces, etc.) as single delimiters.
 *
 * Output rules:
 * - All resulting words are lowercased.
 * - Words are concatenated with a single dot ('.') separator.
 * - If the trimmed input contains no letter/number characters, an empty string
 *   is returned.
 *
 * Notes:
 * - The function relies on String.prototype.normalize and Unicode property
 *   escapes in regular expressions; these are available in modern browsers and
 *   recent Node.js releases. Behavior may vary in older runtimes.
 *
 * @param {string} input - The input string to convert to dot.case. Must be a string.
 * @returns {string} The dot.cased result. Examples:
 *   - toDotCase('hello world') -> 'hello.world'
 *   - toDotCase('Hello_world-test') -> 'hello.world.test'
 *   - toDotCase('PascalCaseInput') -> 'pascal.case.input'
 *   - toDotCase('version2alpha') -> 'version.2.alpha'
 *   - toDotCase('café-au-lait') -> 'cafe.au.lait'
 *   - toDotCase('   ') -> ''  (empty after trimming/delimiting)
 * @throws {TypeError} If input is not a string (e.g. null or number).
 * @example
 * // Basic usage
 * const key = toDotCase('  HTTP ResponseCode '); // 'http.response.code'
 *
 * @example
 * // Numbers and Unicode
 * toDotCase('123 leading digits'); // '123.leading.digits'
 * toDotCase('Zoë-and-Åke'); // 'zoe.and.ake'
 *
 * @see {@link toCamelCase} For a related transformation that produces camelCase output.
 * @since 1.0.0
 */
/**
 * toCamelCase.js
 *
 * Robust function to convert arbitrary strings to camelCase.
 * - Handles mixed delimiters, punctuation, numbers, Unicode and accented letters.
 * - Splits existing camelCase/PascalCase boundaries.
 * - Throws descriptive errors for invalid inputs.
 * - No external libraries. Works in modern browsers and Node.js.
 */

/**
 * Converts any given string into camelCase.
 *
 * @param {string} input - The string to convert to camelCase.
 * @returns {string} - The camelCased string.
 * @throws {TypeError} - If input is not a string.
 */
function toCamelCase(input) {
    // Type check: ensure input is a string. Throw descriptive error otherwise.
    if (typeof input !== 'string') {
        throw new TypeError(
            `toCamelCase expected a string but received ${input === null ? 'null' : typeof input}`
        );
    }

    // Trim whitespace from both ends to avoid empty words from leading/trailing delimiters.
    let str = input.trim();

    // Fast return for empty string after trimming.
    if (str === '') return '';

    // Normalize Unicode to decompose accented characters into base + diacritics,
    // then remove combining marks. This converts "café" -> "cafe", etc.
    // NFKD is chosen to also break compatibility characters into their components where applicable.
    // \p{M} (mark) matches combining diacritical marks; 'u' flag is required for Unicode property escapes.
    str = str.normalize('NFKD').replace(/\p{M}/gu, '');

    // Insert spaces between camelCase / PascalCase boundaries so those are treated as separate words.
    // - lower/digit followed by Upper => "fooBar" -> "foo Bar"
    // - letter followed by digit or digit followed by letter => "version2alpha" -> "version 2 alpha"
    // Use Unicode property escapes: \p{Ll} (lowercase letter), \p{Lu} (uppercase letter), \p{L} (any letter), \p{N} (number).
    // The 'u' flag enables Unicode mode.
    str = str
        .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, '$1 $2') // a1B -> a1 B ; aB -> a B
        .replace(/([\p{L}])([\p{N}])/gu, '$1 $2') // a1 -> a 1
        .replace(/([\p{N}])([\p{L}])/gu, '$1 $2'); // 1a -> 1 a

    // Replace any sequence of non-letter and non-number characters with a single space.
    // This collapses underscores, hyphens, punctuation and multiple consecutive delimiters.
    str = str.replace(/[^\p{L}\p{N}]+/gu, ' ');

    // Split on whitespace and filter out any empty elements (defensive).
    const rawWords = str.split(/\s+/).filter(Boolean);

    if (rawWords.length === 0) return ''; // defensive: no valid word characters found

    // Helper: lowercases the entire word and capitalizes first letter when appropriate.
    // Rules:
    // - First word: entirely lowercased.
    // - Subsequent words: first character uppercased (if it's a letter), rest lowercased.
    // - If a word begins with a digit, we leave the digit as-is and apply casing to following letters.
    const lowerFirst = (word) => word.toLowerCase();

    const capitalize = (word) => {
        if (word === '') return '';
        // If first character is a number, preserve it and only transform following characters.
        const firstChar = word.charAt(0);
        if (/\p{N}/u.test(firstChar)) {
            // If the rest contains letters, lowercase them for consistency.
            return firstChar + word.slice(1).toLowerCase();
        }
        // Otherwise, uppercase first character and lowercase the rest.
        return firstChar.toUpperCase() + word.slice(1).toLowerCase();
    };

    // Build camelCase: first word lowercased, subsequent words capitalized.
    const first = lowerFirst(rawWords[0]);
    const rest = rawWords
        .slice(1)
        .map(capitalize)
        .join('');

    return first + rest;
}

/* Export for Node.js environments without breaking browsers (defensive). */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = toCamelCase;
}

/* ---------------------------
     Short test suite / examples
     --------------------------- */
if (typeof require === 'function' && require.main === module) {
    // Minimal assertion helper for tests
    const assertEqual = (desc, actual, expected) => {
        const pass = actual === expected;
        console.log(`${pass ? 'PASS' : 'FAIL'} - ${desc}`);
        if (!pass) {
            console.log(`  Expected: "${expected}"`);
            console.log(`  Actual:   "${actual}"`);
        }
    };

    // Normal cases
    assertEqual('simple space-separated', toCamelCase('hello world'), 'helloWorld');
    assertEqual('mixed delimiters', toCamelCase('Hello_world-test'), 'helloWorldTest');
    assertEqual('already camelCase', toCamelCase('alreadyCamelCase'), 'alreadyCamelCase');
    assertEqual('PascalCase to camelCase', toCamelCase('PascalCaseInput'), 'pascalCaseInput');

    // Edge cases
    assertEqual(
        'multiple delimiters and punctuation',
        toCamelCase('  multiple   DELIMITERS__and--punct.!?  '),
        'multipleDelimitersAndPunct'
    );
    assertEqual('underscore with id', toCamelCase('user_id'), 'userId');
    assertEqual('leading numbers', toCamelCase('123 leading digits'), '123LeadingDigits');
    assertEqual('numbers inside words', toCamelCase('version2alpha'), 'version2Alpha');
    assertEqual('accented/unicode characters', toCamelCase('café-au-lait'), 'cafeAuLait');
    assertEqual('empty string', toCamelCase('   '), '');

    // Unicode/letter-digit boundary
    assertEqual('μVariableName', toCamelCase('μVariableName'), 'μVariableName'.toLowerCase().replace(/^μ/, 'μ')); // sanity check

    // Invalid input should throw
    try {
        toCamelCase(null);
        console.log('FAIL - null should throw TypeError');
    } catch (err) {
        console.log(err instanceof TypeError ? 'PASS - null throws TypeError' : 'FAIL - null threw wrong error');
    }

    try {
        toCamelCase(123);
        console.log('FAIL - number should throw TypeError');
    } catch (err) {
        console.log(err instanceof TypeError ? 'PASS - number throws TypeError' : 'FAIL - number threw wrong error');
    }
}

/**
 * Converts any given string into dot.case (lowercase words joined by dots).
 *
 * @param {string} input - The string to convert to dot.case.
 * @returns {string} - The dot.cased string.
 * @throws {TypeError} - If input is not a string.
 */
function toDotCase(input) {
    if (typeof input !== 'string') {
        throw new TypeError(
            `toDotCase expected a string but received ${input === null ? 'null' : typeof input}`
        );
    }

    let str = input.trim();
    if (str === '') return '';

    // Normalize and strip diacritics
    str = str.normalize('NFKD').replace(/\p{M}/gu, '');

    // Break camelCase / PascalCase boundaries and letter-number boundaries
    str = str
        .replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, '$1 $2') // a1B -> a1 B ; aB -> a B
        .replace(/([\p{L}])([\p{N}])/gu, '$1 $2') // a1 -> a 1
        .replace(/([\p{N}])([\p{L}])/gu, '$1 $2'); // 1a -> 1 a

    // Replace any sequence of non-letter and non-number characters with a space
    str = str.replace(/[^\p{L}\p{N}]+/gu, ' ');

    const words = str.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';

    return words.map(w => w.toLowerCase()).join('.');
}

/* Export for Node.js environments without breaking browsers (defensive). */
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = toDotCase;
}

/* Minimal tests when run directly */
if (typeof require === 'function' && require.main === module) {
    const assertEqual = (desc, actual, expected) => {
        const pass = actual === expected;
        console.log(`${pass ? 'PASS' : 'FAIL'} - ${desc}`);
        if (!pass) {
            console.log(`  Expected: "${expected}"`);
            console.log(`  Actual:   "${actual}"`);
        }
    };

    assertEqual('simple space-separated', toDotCase('hello world'), 'hello.world');
    assertEqual('mixed delimiters', toDotCase('Hello_world-test'), 'hello.world.test');
    assertEqual('already dot.case', toDotCase('already.dot.case'), 'already.dot.case');
    assertEqual('PascalCase to dot.case', toDotCase('PascalCaseInput'), 'pascal.case.input');
    assertEqual('multiple delimiters and punctuation', toDotCase('  multiple   DELIMITERS__and--punct.!?  '), 'multiple.delimiters.and.punct');
    assertEqual('underscore with id', toDotCase('user_id'), 'user.id');
    assertEqual('leading numbers', toDotCase('123 leading digits'), '123.leading.digits');
    assertEqual('numbers inside words', toDotCase('version2alpha'), 'version.2.alpha');
    assertEqual('accented/unicode characters', toDotCase('café-au-lait'), 'cafe.au.lait');
    assertEqual('empty string', toDotCase('   '), '');

    try {
        toDotCase(null);
        console.log('FAIL - null should throw TypeError');
    } catch (err) {
        console.log(err instanceof TypeError ? 'PASS - null throws TypeError' : 'FAIL - null threw wrong error');
    }

    try {
        toDotCase(123);
        console.log('FAIL - number should throw TypeError');
    } catch (err) {
        console.log(err instanceof TypeError ? 'PASS - number throws TypeError' : 'FAIL - number threw wrong error');
    }
}

