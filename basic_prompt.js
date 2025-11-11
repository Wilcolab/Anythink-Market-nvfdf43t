// basic_prompt.js
// Prompt for implementing a camelCase conversion function.

const prompt = `
Implement a JavaScript function named toCamelCase(str) that converts an input string to camelCase.

Rules:
- Words are sequences of letters and digits separated by spaces, underscores, hyphens, or other non-alphanumeric characters.
- Remove punctuation and separators.
- The first word is entirely lowercase.
- Capitalize the first letter of each subsequent word and lowercase the rest of that word.
- Preserve numeric characters within words.
- Trim leading/trailing whitespace and collapse consecutive separators into single separators.
- If the input is an empty string or contains no letters/digits, return an empty string.
- The function should accept and return strings only.

Examples:
- toCamelCase("hello world") -> "helloWorld"
- toCamelCase("Convert THIS_string-to camelCase!") -> "convertThisStringToCamelCase"
- toCamelCase("  multiple   separators___and--spaces ") -> "multipleSeparatorsAndSpaces"
- toCamelCase("user_id_42") -> "userId42"
- toCamelCase("") -> ""
`;

module.exports = prompt;