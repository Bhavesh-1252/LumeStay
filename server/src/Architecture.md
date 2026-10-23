# Forgot Password: Server-Side Flow

A three-step, OTP-based password reset for a MERN app that uses JWT access tokens and hashed refresh tokens stored in a session model. The OTP model is shared with email verification.

## Flow at a glance

```
forgot-password  ->  verify-reset-code  ->  reset-password
 (send code)         (check code)           (set new password)
```

## Architecture

| Layer | What goes there |
|---|---|
| **Routes** | Three POST routes, each with validation and rate limiting in front |
| **Middleware** | Input validation, rate limiter (strict on `forgot-password`) |
| **Controllers** | Thin: read the request, call helpers, shape the response |
| **Helpers / utils** | `createAndSendOtp`, `verifyOtp`, OTP generator, mail sender |
| **Models** | `User`, `Otp` (shared with email verification), `Session` (hashed refresh tokens) |

Controllers decide the HTTP response. Helpers hold the security logic. That way email verification and password reset share one tested implementation.

## Endpoints

| Endpoint | Purpose | Returns |
|---|---|---|
| `POST /auth/forgot-password` | Request a code (also used by Resend) | Generic success message |
| `POST /auth/verify-reset-code` | Check the OTP | OK (the OTP is kept) |
| `POST /auth/reset-password` | Set the new password | Success message, no tokens |

### 1. `POST /auth/forgot-password`

1. **Middleware:** rate limit, then validate the email format.
2. **Controller:** lowercase the email and find the user.
3. **No user?** Respond with the generic success message and stop.
4. **Helper `createAndSendOtp`:**
   - Look for an existing OTP for this user and purpose.
   - If it was created less than about 60 seconds ago, send nothing.
   - Otherwise delete the old one and create a new one: 6 digits from `crypto.randomInt`, hashed, `attempts` at 0.
   - Send the email (in dev, print the code to the console).
5. **Respond** with the same generic success message every time. A mail failure is logged, never shown.

### 2. `POST /auth/verify-reset-code`

1. **Middleware:** validate email and code format.
2. **Controller:** find the user. No user gives the same error as a wrong code.
3. **Helper `verifyOtp(userId, "password-reset", code)`:**
   - Find the OTP, or return expired.
   - Check `createdAt` plus 10 minutes against now.
   - Count the attempt with one atomic update that only works while `attempts` is under the limit.
   - Compare the hash.
4. **On failure:** respond with a reason code and `attemptsLeft`.
5. **On success:** respond OK. Do not delete the OTP.

### 3. `POST /auth/reset-password`

1. **Middleware:** validate email, code and new password (same rules as register).
2. **Controller:** find the user, then run `verifyOtp` again.
3. **Save the new password**, hashed.
4. **Delete all `Session` documents** for that user (logs out every device).
5. **Delete the OTP.**
6. **Send** the "password changed" email and respond success. No tokens are issued.

> The order matters: save the password first, delete the OTP last. If something fails in between, the user can retry with the same code instead of being locked out.

## OTP model notes

| Field | Purpose |
|---|---|
| `userId`, `email` | who the code belongs to |
| `otpHash` | the code, stored hashed, never plain |
| `purpose` | `email-verification` or `password-reset` |
| `attempts` | number of checks made against this code (default 0) |
| `expiresAt` | TTL field, 10 minutes |

- Add a **unique compound index** on `userId` + `purpose`, so each user has at most one active code per purpose.
- `expiresAt` must use `default: Date.now` (no parentheses), so the timestamp is evaluated per document.
- MongoDB's TTL cleanup runs about once a minute, so `verifyOtp` must also check `createdAt` itself.
- Every check counts an attempt, including a correct one, because the counter is incremented before the hash comparison. Steps 2 and 3 together use 2 of the allowed attempts (limit: 5).
- Increment `attempts` atomically (one update with `attempts < limit` as the condition) so parallel requests cannot all get a free guess.

## Response shapes

Use one shape everywhere: `{ success, message, code?, attemptsLeft? }`.

| Situation | Status | `code` |
|---|---|---|
| Bad input format | 422 | `VALIDATION_ERROR` |
| Wrong code | 400 | `OTP_INVALID` |
| Expired or missing code | 400 | `OTP_EXPIRED` |
| Too many attempts | 429 | `OTP_ATTEMPTS_EXCEEDED` |
| Rate limiter hit | 429 | `RATE_LIMITED` |

Validation errors may also include a `fields` object (`{ email: "Enter a valid email address" }`) so the frontend can show each message under its input.

## Rate limiting

Per IP, using `express-rate-limit`, placed first in the route chain:

| Route | Suggested limit |
|---|---|
| `forgot-password` | 5 per 15 minutes |
| `verify-reset-code`, `reset-password` | 10 per 15 minutes |

- The rate limiter covers one machine hammering the API. The 60-second `createdAt` check covers inbox spam per user, and the `attempts` counter covers code guessing per code.
- Behind a proxy or host (Render, Railway, Nginx), set `app.set("trust proxy", 1)`.
- Counters live in server memory. For multiple instances, use a shared store such as Redis.

## Validation

- Define the email, OTP and password rules once (for example in `validators/fields.js`) and reuse them across schemas, including register.
- The validate middleware should write the validated `value` back to `req.body` so trimming and lowercasing take effect.
- Use `abortEarly: false` and `errors: { wrap: { label: false } }` to collect all errors without quotes around field names.

## Beginner traps

- **Password hashing:** if your `User` model hashes in a `pre("save")` hook, update the password with `user.password = ...; await user.save()`. Update queries like `findByIdAndUpdate` skip that hook and would store the new password as plain text.
- **Always filter OTP queries by `purpose`**, or a reset code could verify an email.
- **Same behavior for unknown users.** Message, status code and response shape should all match the known-user case.
- **Never log the OTP in production.** Only print it in development.
- **Revoke sessions on reset.** Access tokens already issued stay valid until they expire, so keep their lifetime short (about 15 minutes).

## Build order

1. Fix the schema (`Date.now` default, `attempts`, unique index on `userId` + `purpose`), then clear the OTP collection.
2. Write `verifyOtp` and `createAndSendOtp`, point email verification at them, and retest it.
3. Build `forgot-password`, then `verify-reset-code`, then `reset-password`, testing each in Postman, including every failure path (wrong code, expired code, too many attempts, unknown email).
4. Add rate limiting last.

# Forgot Password: Algorithm

Pseudocode for the OTP-based password reset. Read it before writing any JavaScript, then translate one block at a time.

## Constants

```
OTP_LIFETIME    = 10 minutes
RESEND_COOLDOWN = 60 seconds
MAX_ATTEMPTS    = 5
PURPOSE         = "password-reset"
GENERIC_REPLY   = "If this email is registered, a code has been sent."
```

## Helper A: `createAndSendOtp(user)`

```
existing = find Otp where userId = user.id AND purpose = PURPOSE

if existing AND (now - existing.createdAt) < RESEND_COOLDOWN:
    return                                  // too soon, send nothing

delete Otp where userId = user.id AND purpose = PURPOSE

code = random 6-digit number (crypto)
create Otp { userId, email, purpose: PURPOSE, otpHash: hash(code), attempts: 0 }

send email(user.email, code)                // dev: print code to console
```

## Helper B: `verifyOtp(userId, code)`

```
otp = find Otp where userId AND purpose = PURPOSE
if not otp:
    return FAIL("OTP_EXPIRED")

if now > otp.createdAt + OTP_LIFETIME:
    delete otp
    return FAIL("OTP_EXPIRED")

// count the attempt atomically: only succeeds while attempts < MAX
updated = update Otp where _id = otp.id AND attempts < MAX_ATTEMPTS
          set attempts = attempts + 1, return the new document
if not updated:
    delete otp
    return FAIL("OTP_ATTEMPTS_EXCEEDED")

if hash(code) does not match updated.otpHash:
    if updated.attempts >= MAX_ATTEMPTS:
        delete updated
        return FAIL("OTP_ATTEMPTS_EXCEEDED")
    return FAIL("OTP_INVALID", attemptsLeft = MAX_ATTEMPTS - updated.attempts)

return OK
```

## Endpoint 1: `POST /auth/forgot-password`

```
[rate limiter] -> [validate email]

user = find User by email (lowercased)

if user exists:
    try: createAndSendOtp(user)
    catch error: log it                     // never show the user

respond 200 GENERIC_REPLY                   // same reply every time
```

## Endpoint 2: `POST /auth/verify-reset-code`

```
[rate limiter] -> [validate email, code]

user = find User by email
if not user:
    respond 400 "OTP_INVALID"               // same as a wrong code

result = verifyOtp(user.id, code)
if result is FAIL:
    respond (429 if ATTEMPTS_EXCEEDED else 400) with result.reason, attemptsLeft

respond 200 OK                              // OTP is NOT deleted
```

## Endpoint 3: `POST /auth/reset-password`

```
[rate limiter] -> [validate email, code, newPassword]

user = find User by email
if not user:
    respond 400 "OTP_INVALID"

result = verifyOtp(user.id, code)
if result is FAIL:
    respond with result.reason (same mapping as above)

user.password = newPassword                 // hashed by the model's pre-save hook
save user

delete all Session where userId = user.id   // logs out every device
delete Otp where userId = user.id AND purpose = PURPOSE

send email "your password was changed"
respond 200 "Password updated"              // no tokens issued
```

## Why the order is what it is

- **Cooldown before creating:** stops a person from spamming someone's inbox.
- **Attempt counted before the hash check, in one atomic update:** parallel requests can't all get a free guess.
- **Password saved first, sessions and OTP deleted after:** if anything fails midway, the user can retry with the same code instead of being locked out.
- **Same reply for unknown users:** an attacker can't learn which emails are registered.

## Trace these cases on paper before coding

| Case | Expected result |
|---|---|
| Unknown email on forgot-password | Generic reply, no email sent |
| Resend after 30 seconds | Generic reply, no new email |
| Resend after 90 seconds | Old OTP deleted, new one created and sent |
| Five wrong codes, then the right one | `OTP_ATTEMPTS_EXCEEDED`, OTP deleted |
| Right code after 11 minutes | `OTP_EXPIRED` |
| Reusing the code after a successful reset | `OTP_EXPIRED` (the OTP was deleted) |

Each case should land on exactly one response from the algorithm above.