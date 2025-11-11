/**
 * Convert a string to camelCase.
 *
 * Handles spaces, underscores, hyphens and other non-alphanumeric separators.
 * Examples:
 *   toCamelCase('first name')    -> 'firstName'
 *   toCamelCase('user_id')       -> 'userId'
 *   toCamelCase('SCREEN_NAME')   -> 'screenName'
 *   toCamelCase('mobile-number') -> 'mobileNumber'
 *
 * Returns an empty string for non-string or empty input.
 */
function toCamelCase(input) {
    if (typeof input !== 'string') return '';
    const str = input.trim();
    if (!str) return '';

    // Split on any non-alphanumeric characters (spaces, hyphens, underscores, etc.)
    const parts = str.split(/[^A-Za-z0-9]+/).filter(Boolean);
    if (parts.length === 0) return '';

    // If there's no separator, preserve inner casing but ensure the first char is lowercase.
    if (parts.length === 1) {
        const single = parts[0];
        return single.charAt(0).toLowerCase() + single.slice(1);
    }

    return parts
        .map((part, index) => {
            const lower = part.toLowerCase();
            if (index === 0) return lower;
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('');
}

// Export for CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = toCamelCase;
}
export default toCamelCase;

// Quick examples (uncomment to run)
// console.log(toCamelCase('first name'));    // firstName
// console.log(toCamelCase('user_id'));       // userId
// console.log(toCamelCase('SCREEN_NAME'));   // screenName
// console.log(toCamelCase('mobile-number')); // mobileNumber