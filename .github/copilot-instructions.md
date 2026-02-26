# Copilot Instructions – Secure Input Validation (AI-Driven SDLC)

You are an AI coding assistant working in a security-sensitive codebase.
All generated code MUST follow secure-by-default practices, especially for user input handling.

## 1. General Security Principles
- Treat ALL external input as untrusted (forms, APIs, query params, headers).
- Prefer allowlists over blocklists.
- Fail fast and fail safely.
- Never rely on client-side validation alone.
- Assume malicious intent (XSS, SQL injection, command injection, buffer abuse).

## 2. Input Validation Rules
- Validate input at BOTH:
  - Client side (UX)
  - Server side (security)
- Enforce:
  - Type checks
  - Length limits
  - Format constraints (regex)
  - Character allowlists
- Reject unexpected fields (no silent acceptance).

## 3. Sanitization & Encoding
- Sanitize user input before storage or rendering.
- Encode output based on context:
  - HTML encoding for UI
  - URL encoding for query params
  - JSON-safe encoding for APIs
- NEVER directly interpolate user input into HTML, SQL, or shell commands.

## 4. Field-Specific Rules
### Name
- Allow only alphabetic characters and spaces.
- Enforce min/max length.
- Reject scripts, HTML, emojis, and special characters.

### Address
- Allow alphanumeric characters, spaces, commas, hyphens.
- Enforce reasonable length limits.
- Strip HTML tags and scripts.

### Phone Number
- Accept only digits (optionally leading `+`).
- Enforce country-aware length validation.
- Reject embedded text or symbols.

## 5. Error Handling
- Use generic error messages for users.
- Avoid leaking validation rules or internal logic.
- Log validation failures securely (no sensitive data).

## 6. Libraries & Patterns
- Prefer well-known validation libraries (e.g., Zod, Yup, Joi, Validator.js).
- Centralize validation logic (schemas, DTOs, middleware).
- Avoid custom regex unless necessary—comment them clearly if used.

## 7. Code Quality Requirements
- All validation logic must be:
  - Explicit
  - Readable
  - Well-commented
- No `any` types (TypeScript).
- No disabled lint or security rules.
- No TODOs related to security.

## 8. Prohibited Practices
- ❌ Trusting frontend validation alone
- ❌ Direct DOM insertion of user input
- ❌ Regex without length constraints
- ❌ Silent sanitization without validation
- ❌ Accepting extra/unexpected fields

## 9. Testing Expectations
- Generate unit tests for:
  - Valid inputs
  - Boundary cases
  - Malicious payloads (XSS, SQL-like strings)
- Include negative test cases by default.

## 10. Output Expectation
When generating code:
- Explain validation decisions briefly in comments.
- Default to the most secure interpretation if requirements are unclear.