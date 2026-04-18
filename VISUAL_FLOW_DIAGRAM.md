# 401 Error Handling - Visual Flow

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Your React Components                        │
│                                                                   │
│  const handleClick = async () => {                              │
│    apiRequest.post('/api/data', payload)  ← Component makes     │
│      .then(res => { /* use data */ })        API call           │
│      .catch(err => { /* handle */ })                            │
│  }                                                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                  REQUEST INTERCEPTOR                             │
│           (src/utils/api-client.js)                             │
│                                                                   │
│  ✓ Check if auth.token exists                                  │
│  ✓ Add Authorization header                                    │
│  ✓ Pass request through                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND API                                   │
│                                                                   │
│  POST /api/data                                                 │
│  Headers: Authorization: <token>                               │
│                                                                   │
│  Returns:                                                        │
│  ├─ 200 OK ✓                                                   │
│  ├─ 400 Bad Request                                            │
│  ├─ 401 Unauthorized ← TOKEN EXPIRED/INVALID                  │
│  ├─ 403 Forbidden                                              │
│  └─ 500 Server Error                                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                 RESPONSE INTERCEPTOR                             │
│           (src/utils/api-client.js)                             │
│                                                                   │
│  Check Response Status:                                         │
│                                                                   │
│  IF 401 Unauthorized:                                           │
│    ├─ Clear sessionStorage (token, user, store)               │
│    ├─ Call auth.signOut()                                     │
│    ├─ Log warning                                             │
│    └─ Redirect to /auth/login ✓ DONE!                         │
│                                                                   │
│  IF 200-399 (Success):                                          │
│    └─ Return response to component ✓                           │
│                                                                   │
│  IF Other errors (400, 403, 500, etc.):                        │
│    └─ Reject promise (goes to .catch())  ✓                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Back to Component                              │
│                                                                   │
│  .then(res => {                 .catch(err => {                │
│    // 200-399 responses       // Other errors (400, 403, etc)  │
│    // 401 never reaches here! // 401 also never reaches here!  │
│  })                            })                               │
│                                                                   │
│  For 401: Automatically redirected, component unmounted         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Lifecycle with 401 Handling

```
Component Renders
    │
    ├─ Makes API call
    │    └─ Interceptor adds auth header
    │         └─ Request sent to backend
    │              └─ Backend returns 401 (token expired)
    │                   └─ Response interceptor catches it
    │                        ├─ Clears session storage
    │                        ├─ Calls auth.signOut()
    │                        ├─ Router.push('/auth/login')
    │                        └─ Component unmounts
    │
    └─ Page redirects to login
         └─ User sees login form
```

---

## Where to Add Global Error Handlers

```javascript
// src/utils/api-client.js - Response Interceptor

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Add handlers here for different status codes:
    
    if (error.response?.status === 401) {
      // ✓ Already implemented
    }
    
    if (error.response?.status === 403) {
      // Forbidden - access denied (not expired token)
      console.error('Forbidden');
    }
    
    if (error.response?.status === 429) {
      // Rate limited - too many requests
      console.error('Rate limited');
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error');
    }
    
    // Always reject so .catch() in components can handle it too
    return Promise.reject(error);
  }
);
```

---

## Comparison: Before vs After

### BEFORE: Manual 401 Handling in Every Component

```
Component A:
  catch(err) {
    if (err.response?.status === 401) {
      router.push('/login')  ← Manual redirect
    }
  }

Component B:
  catch(err) {
    if (err.response?.status === 401) {
      router.push('/login')  ← Duplicate code
    }
  }

Component C:
  catch(err) {
    // Forgot to add 401 check! ← Bug!
  }

Component D:
  catch(err) {
    if (err.response?.status === 401) {
      // Wrong redirect URL
      router.push('/auth/signin')  ← Inconsistent
    }
  }
```

❌ Repetitive, error-prone, inconsistent

---

### AFTER: Centralized 401 Handling

```
API Interceptor (one place):
  if (error.response?.status === 401) {
    // Handle here ✓
    router.push('/auth/login')
  }

Component A:
  catch(err) { /* handle other errors */ }

Component B:
  catch(err) { /* handle other errors */ }

Component C:
  catch(err) { /* handle other errors */ }

Component D:
  catch(err) { /* handle other errors */ }
```

✅ Single source of truth, consistent, maintainable

---

## Request/Response Cycle Example

```
USER ACTION
    ↓
Component: apiRequest.post('/items/add', { name: 'Item' })
    ↓
REQUEST INTERCEPTOR:
  {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIs...'  ← Added automatically
    },
    data: { name: 'Item' }
  }
    ↓
BACKEND API:
  Validates token
    │
    ├─ Token valid & user has permission
    │    └─ Returns: { status: 200, data: { id: 1, name: 'Item' } }
    │
    └─ Token expired/invalid
         └─ Returns: { status: 401, error: 'Unauthorized' }
    ↓
RESPONSE INTERCEPTOR:
  if (401) {
    Clear session storage
    Call auth.signOut()
    Router.push('/auth/login')
  }
    ↓
USER:
  Sees login page
  Logs in again
  Token refreshed
  Back to using app
```

---

## File Dependencies

```
_app.js
    ├─ imports initializeApiClient()
    │   └─ from api-client.js
    │
    └─ creates ApiClientInitializer component
        └─ calls initializeApiClient(auth, router)
            ├─ Sets up request interceptor
            ├─ Sets up response interceptor
            └─ Both use auth context and router

Your Components
    ├─ Option A: Import { apiRequest } from api-request.js
    │   └─ Uses axios with interceptors
    │
    └─ Option B: Import axios directly
        └─ Still uses interceptors globally
```

---

## Error Handling Scenarios

```
Scenario 1: Valid Token, API Returns 200
  ✓ Request interceptor adds header
  ✓ Request succeeds
  ✓ Response interceptor passes data through
  ✓ Component gets data in .then()

Scenario 2: Expired Token, API Returns 401
  ✓ Request interceptor adds (old) header
  ✓ Request sent
  ✓ API returns 401
  ✓ Response interceptor catches 401
  ✓ Clears session storage
  ✓ Calls auth.signOut()
  ✓ Redirects to /auth/login
  ✗ Component's .then() NOT called
  ✗ Component's .catch() NOT called
  ✓ Component unmounts when page changes

Scenario 3: Missing Token, API Returns 401
  ✓ Request interceptor checks for token (none found, skips header)
  ✓ Request sent without Authorization
  ✓ API returns 401
  ✓ Response interceptor catches 401
  ✓ Redirects to login (same as Scenario 2)

Scenario 4: Valid Token, API Returns 400 (Bad Request)
  ✓ Request interceptor adds header
  ✓ Request succeeds in delivery
  ✓ API validates data and returns 400
  ✓ Response interceptor checks status (not 401)
  ✓ Rejects promise
  ✓ Component gets error in .catch()
  ✓ Component handles 400 error gracefully

Scenario 5: Network Error (No Backend Response)
  ✓ Request interceptor adds header
  ✓ Request fails (network down, CORS, timeout)
  ✓ No response from backend
  ✓ Response interceptor checks error
  ✓ No 401 status, rejects promise
  ✓ Component handles network error
```

---

## Summary Flowchart

```
API Call
   ↓
[REQUEST] → Add Auth Header
   ↓
Backend API
   ↓
[RESPONSE] Status Check?
   ├─ 200-399 ✓ → Return to .then()
   ├─ 401 ✗ → Redirect to login (interceptor handles)
   └─ Other → Reject to .catch()
```

Simple, clean, and centralized! 🎉
