# Security Assessment & Recommendations

Comprehensive analysis of current security measures and missing protections.

---

## ✅ Current Security Measures (Good!)

### Backend

1. **✅ Helmet Security Headers** - Recently added
2. **✅ Password Hashing** - Using bcrypt (via Mongoose pre-save hook)
3. **✅ JWT Authentication** - Token-based auth with 7-day expiration
4. **✅ HttpOnly Cookies** - JWT stored in httpOnly cookies (XSS protection)
5. **✅ SameSite Cookie** - `sameSite: 'strict'` (CSRF protection)
6. **✅ Input Validation** - Zod schemas for all user inputs
7. **✅ Password Removed from Responses** - `sanitizeUser()` function
8. **✅ Environment Variable Validation** - Zod schema with minimum requirements
9. **✅ JWT Secret Validation** - Minimum 32 characters enforced
10. **✅ Secure Cookie in Production** - `secure: true` when NODE_ENV=production
11. **✅ CORS with Credentials** - Proper CORS configuration

### Frontend

1. **✅ Credentials Included** - All API calls use `credentials: 'include'`
2. **✅ Input Validation** - Content-Type checks for API responses
3. **✅ Error Handling** - Proper error handling in API calls

---

## ❌ Missing Critical Security Measures

### 🔴 HIGH PRIORITY

#### 1. **Rate Limiting** ⚠️ CRITICAL
**Status:** Package installed but NOT implemented

**Risk:** 
- Brute force attacks on login/register endpoints
- API abuse and DoS attacks
- Password guessing attacks

**Solution:**
```typescript
// Add to app.ts
import rateLimit from 'express-rate-limit';

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  skipSuccessfulRequests: true, // Don't count successful logins
});

// Apply to routes
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

**Impact:** High - Prevents brute force and API abuse

---

#### 2. **Account Enumeration Protection**
**Status:** VULNERABLE

**Risk:**
- Login endpoint reveals if email exists ("Invalid email or password")
- Register endpoint reveals if email/username exists (409 with specific message)
- Attackers can enumerate valid accounts

**Current Code (VULNERABLE):**
```typescript
// auth.ts - register
if (existingUser.email === email) {
  throw new Error('Email already exists'); // ❌ Reveals email exists
}
```

**Solution:**
```typescript
// Use generic error messages
// For registration
res.status(400).json({ 
  error: 'Registration failed. Please try again.' 
});

// For login - already good!
res.status(401).json({ 
  error: 'Invalid email or password' // ✅ Generic message
});

// Add timing attack protection (make all checks take same time)
```

**Impact:** Medium - Makes account enumeration harder

---

#### 3. **CORS Origin Restriction**
**Status:** INSECURE (allows all origins)

**Current Code:**
```typescript
cors({
  origin: true, // ❌ Allows ALL origins in all environments
  credentials: true,
})
```

**Risk:**
- Any website can make authenticated requests to your API
- Potential for CSRF attacks despite SameSite cookies

**Solution:**
```typescript
// app.ts
const allowedOrigins = config.nodeEnv === 'production'
  ? ['https://yourdomain.com', 'https://www.yourdomain.com']
  : ['http://localhost:3000', 'http://localhost:3001'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
```

**Impact:** High - Prevents unauthorized domains from accessing your API

---

#### 4. **MongoDB Injection Protection**
**Status:** PARTIALLY PROTECTED

**Risk:**
- NoSQL injection attacks possible with query operators
- Example: `{ "email": { "$ne": null } }` as input

**Current Protection:**
- Mongoose provides some protection
- Zod validation helps

**Additional Protection Needed:**
```typescript
// Install: npm install express-mongo-sanitize
import mongoSanitize from 'express-mongo-sanitize';

// Add to app.ts (after express.json())
app.use(mongoSanitize({
  replaceWith: '_', // Replace $ and . with _
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized potentially malicious input: ${key}`);
  },
}));
```

**Impact:** Medium - Adds extra layer against NoSQL injection

---

#### 5. **Request Size Limits**
**Status:** NOT CONFIGURED

**Risk:**
- Large payload attacks (JSON bomb)
- Memory exhaustion
- DoS attacks

**Solution:**
```typescript
// app.ts
app.use(express.json({ limit: '10kb' })); // Limit JSON payload
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
```

**Impact:** Medium - Prevents large payload attacks

---

### 🟡 MEDIUM PRIORITY

#### 6. **Password Strength Requirements**
**Status:** WEAK (minimum 6 characters only)

**Current:**
```typescript
password: z.string().min(6, 'Password must be at least 6 characters'),
```

**Recommended:**
```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

**Alternative (More User-Friendly):**
```typescript
// Just enforce minimum 10 characters (allows passphrases)
password: z.string()
  .min(10, 'Password must be at least 10 characters')
  .max(128)
```

**Impact:** Medium - Improves account security

---

#### 7. **JWT Token Revocation/Blacklist**
**Status:** NOT IMPLEMENTED

**Risk:**
- Logged out tokens remain valid until expiration
- Compromised tokens can't be revoked
- User can't force logout all sessions

**Issue:**
- Current logout only clears cookie client-side
- Token is still valid for 7 days

**Solution Options:**

**Option A: Token Blacklist (Simple)**
```typescript
// Create Redis/MongoDB collection for blacklisted tokens
// On logout, add token to blacklist
// In auth middleware, check if token is blacklisted
```

**Option B: Refresh Token Pattern (Better)**
```typescript
// Short-lived access token (15 min)
// Long-lived refresh token (7 days)
// Store refresh tokens in database
// Can revoke refresh tokens
```

**Impact:** Medium - Better session management and security

---

#### 8. **Audit Logging**
**Status:** PARTIAL (basic console.log only)

**Missing:**
- No structured logging for security events
- No audit trail for sensitive operations
- No alerting for suspicious activity

**You have infrastructure in place (`backend/src/logger/auditLogger.ts`) but it's not being used!**

**Solution:**
```typescript
// Use your existing auditLogger
import { auditLogger } from '../logger/auditLogger';

// In auth controller
export const login = async (req: Request, res: Response) => {
  try {
    // ... existing code ...
    
    auditLogger.info('User login successful', {
      userId: user._id,
      email: user.email,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  } catch (error) {
    auditLogger.warn('Failed login attempt', {
      email: req.body.email,
      ip: req.ip,
      error: error.message,
    });
  }
};

// Log sensitive operations
auditLogger.info('City added', { userId, cityId, ip });
auditLogger.warn('Suspicious activity', { userId, action, ip });
```

**What to Log:**
- ✅ Successful logins
- ✅ Failed login attempts
- ✅ Registration events
- ✅ Password changes
- ✅ Account modifications
- ✅ Suspicious patterns

**Impact:** Medium - Essential for security monitoring and incident response

---

#### 9. **Session Timeout & Inactivity**
**Status:** NOT IMPLEMENTED

**Current:**
- JWT expires in 7 days regardless of activity
- No automatic logout on inactivity

**Risk:**
- Abandoned sessions remain active
- Shared/public computers pose risk

**Solution:**
```typescript
// Add "last activity" timestamp to JWT
// On each request, check last activity
// If > 1 hour inactive, force re-authentication

// Or implement sliding sessions
// Refresh token on each request if > halfway to expiration
```

**Impact:** Low-Medium - Better session security

---

#### 10. **HTTP Parameter Pollution (HPP) Protection**
**Status:** NOT IMPLEMENTED

**Risk:**
- Multiple parameters with same name can cause unexpected behavior
- Example: `?lat=40.7128&lat=34.0522` (which one is used?)

**Solution:**
```typescript
// Install: npm install hpp
import hpp from 'hpp';

// Add to app.ts (after query parser)
app.use(hpp()); // Blocks parameter pollution
```

**Impact:** Low - Defense in depth

---

### 🟢 LOW PRIORITY (Nice to Have)

#### 11. **Content Security Policy (CSP)**
**Status:** Disabled (correct for API)

**Note:** Currently disabled because you're serving an API. This is correct!

If you ever serve HTML from backend:
```typescript
helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
    },
  },
})
```

**Impact:** N/A for API-only backend

---

#### 12. **Email Verification**
**Status:** NOT IMPLEMENTED

**Risk:**
- Users can register with fake emails
- No way to recover accounts
- Spam registrations possible

**Solution:**
- Send verification email on registration
- Account inactive until verified
- Add password reset flow

**Impact:** Medium - Improves account security and enables password recovery

---

#### 13. **Two-Factor Authentication (2FA)**
**Status:** NOT IMPLEMENTED

**Impact:** Medium - Significant security improvement for high-value accounts

---

#### 14. **API Versioning**
**Status:** NOT IMPLEMENTED

**Current:** `/api/auth/login`
**Better:** `/api/v1/auth/login`

**Benefit:** 
- Allows breaking changes without affecting existing clients
- Better API lifecycle management

**Impact:** Low - Good practice, not security-critical

---

#### 15. **Request ID Tracking**
**Status:** NOT IMPLEMENTED

**Solution:**
```typescript
import { v4 as uuidv4 } from 'uuid';

app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});
```

**Benefit:** Better debugging and security incident tracking

**Impact:** Low - Operational improvement

---

#### 16. **Dependency Scanning**
**Status:** NOT CONFIGURED

**Solution:**
```bash
# Run npm audit regularly
npm audit

# Fix vulnerabilities
npm audit fix

# Add to CI/CD pipeline
```

**Impact:** Medium - Catches known vulnerabilities

---

#### 17. **Environment-Specific Security**
**Status:** PARTIAL

**Missing Production Configs:**
```typescript
// Add to config.ts
export const config = {
  // ... existing ...
  security: {
    enableCsrf: env.NODE_ENV === 'production',
    enableRateLimit: true,
    rateLimitStrict: env.NODE_ENV === 'production',
    allowedOrigins: env.NODE_ENV === 'production'
      ? env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:3000'],
  },
};
```

---

## Frontend Security Issues

### ❌ Missing Protections

#### 1. **XSS Protection**
**Status:** Partially Protected (React escapes by default)

**Additional Protection:**
```typescript
// Install DOMPurify if you ever need to render HTML
import DOMPurify from 'isomorphic-dompurify';

// Sanitize before rendering
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userContent) 
}} />
```

**Impact:** Low (React provides good default protection)

---

#### 2. **Sensitive Data in LocalStorage**
**Status:** ✅ GOOD - Using httpOnly cookies

**Don't Store:**
- ❌ JWT tokens in localStorage (you're already avoiding this ✅)
- ❌ Passwords
- ❌ API keys

---

#### 3. **HTTPS Enforcement**
**Status:** MANUAL

**Add to Frontend:**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ]
  },
}
```

---

## Environment Variables Security

### ❌ Issues

#### 1. **No .env Validation at Runtime**
**Status:** Backend has validation ✅, but no checks for:
- JWT_SECRET strength in production
- Secure database credentials
- Production vs development configs

#### 2. **Secrets in Repository Risk**
**Current:** `.env` in `.gitignore` ✅

**Best Practice:**
- Use secrets manager (AWS Secrets Manager, Azure Key Vault)
- Environment-specific .env files
- Never commit `.env.production`

---

## Database Security

### Current Status

✅ **Good:**
- Password hashing before storage
- Mongoose schema validation
- Connection string validation

❌ **Missing:**
- Database connection encryption (SSL/TLS)
- Database user with minimal permissions
- Connection pooling configuration
- Query timeout settings

**Recommended MongoDB Connection:**
```typescript
// connection.ts
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  ssl: config.nodeEnv === 'production', // Enable SSL in production
  authSource: 'admin',
};

mongoose.connect(config.mongodb.url, options);
```

---

## Security Checklist

### 🔴 Critical (Do Immediately)

- [ ] **Implement rate limiting** on all endpoints
- [ ] **Fix CORS** - restrict to specific origins
- [ ] **Add request size limits** (10kb for JSON)
- [ ] **Fix account enumeration** on register endpoint

### 🟡 Important (Do Soon)

- [ ] **Implement audit logging** for security events
- [ ] **Add MongoDB injection protection** (express-mongo-sanitize)
- [ ] **Strengthen password requirements** (min 8-10 chars)
- [ ] **Add HPP protection**
- [ ] **Implement token revocation** (blacklist or refresh tokens)

### 🟢 Nice to Have (Do Later)

- [ ] **Add email verification**
- [ ] **Implement 2FA**
- [ ] **Add API versioning**
- [ ] **Setup dependency scanning** in CI/CD
- [ ] **Add request ID tracking**
- [ ] **Implement session timeout**
- [ ] **Add database connection security** (SSL, pooling)

---

## Quick Wins (Implement These Now)

### 1. Rate Limiting (5 minutes)

```bash
# Already installed, just implement it!
```

```typescript
// backend/src/app.ts
import rateLimit from 'express-rate-limit';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});

app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);
```

### 2. Request Size Limits (1 minute)

```typescript
// backend/src/app.ts
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));
```

### 3. MongoDB Sanitization (2 minutes)

```bash
npm install express-mongo-sanitize
```

```typescript
// backend/src/app.ts
import mongoSanitize from 'express-mongo-sanitize';
app.use(mongoSanitize());
```

### 4. CORS Fix (3 minutes)

```typescript
// backend/src/config.ts
allowedOrigins: env.NODE_ENV === 'production'
  ? env.ALLOWED_ORIGINS?.split(',') || []
  : ['http://localhost:3000'],

// backend/src/app.ts
cors({
  origin: config.allowedOrigins,
  credentials: true,
})
```

### 5. HPP Protection (1 minute)

```bash
npm install hpp
```

```typescript
// backend/src/app.ts
import hpp from 'hpp';
app.use(hpp());
```

---

## Testing Security

### Recommended Tools

1. **OWASP ZAP** - Automated security testing
2. **npm audit** - Check for vulnerable dependencies
3. **Postman** - Test API security manually
4. **curl** - Test rate limiting and headers

### Test Commands

```bash
# Check security headers
curl -I http://localhost:4000/health

# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:4000/api/auth/login -d '{"email":"test@test.com","password":"wrong"}' -H "Content-Type: application/json"; done

# Check for dependency vulnerabilities
npm audit

# Test MongoDB injection
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$ne": null}, "password": {"$ne": null}}'
```

---

## Production Security Checklist

Before deploying to production:

- [ ] JWT_SECRET is strong and unique (32+ characters)
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] CORS restricted to production domain
- [ ] Rate limiting enabled
- [ ] Database uses SSL/TLS connection
- [ ] Database user has minimal permissions
- [ ] Environment variables stored securely (not in code)
- [ ] Audit logging enabled
- [ ] Error messages don't reveal sensitive info
- [ ] Security headers configured (Helmet)
- [ ] Request size limits in place
- [ ] MongoDB injection protection enabled
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] Monitoring and alerting configured

---

## Summary

### Security Score: 6/10

**Strengths:**
- Strong password hashing
- HttpOnly cookies with SameSite
- Good input validation
- JWT authentication
- Helmet security headers

**Critical Gaps:**
- ❌ No rate limiting (package installed but not used!)
- ❌ CORS allows all origins
- ❌ No request size limits
- ❌ Account enumeration possible
- ❌ No audit logging (infrastructure exists but not used!)

**Recommendation:** 
Implement the "Quick Wins" section immediately. These 5 changes (15 minutes total) will improve your security score from 6/10 to 8/10.

---

**Last Updated:** February 2026
