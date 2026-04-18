# API Error Handling - 401 Redirect Implementation

## Overview

This project now has **centralized 401 error handling** through axios interceptors. All API calls that return a 401 (Unauthorized) status will automatically:
1. Clear authentication data
2. Sign out the user
3. Redirect to the login page

**No need to add 401 handling in every component!**

---

## How It Works

### 1. Axios Interceptors (`src/utils/api-client.js`)

The API client has been configured with two interceptors:

**Request Interceptor:**
- Automatically adds the Authorization token to every API request
- No need to manually set headers in each component

**Response Interceptor:**
- Catches all 401 responses globally
- Clears session storage
- Calls auth.signOut()
- Redirects to /auth/login

### 2. Initialization (`src/pages/_app.js`)

The ApiClientInitializer component initializes the interceptors when the app loads:
- Runs after authentication is ready
- Injects router and auth context into the interceptor

---

## Usage Patterns

### Before (Old Way - Still Works)

```javascript
// Manual header setup
axios.defaults.headers = {
  Authorization: auth.token
}

// Manual API call
axios.post(host + "/admin/item/all", data)
  .then(res => {
    // handle success
  })
  .catch(err => {
    // Manual 401 checking
    let status = (!!err.response ? err.response.status : 0);
    if (status == 401) {
      auth.signOut();
      router.push("/auth/login")
    }
  })
```

### After (New Way - Recommended)

```javascript
import { apiRequest } from 'src/utils/api-request';

// Direct API call - headers and 401 handled automatically
apiRequest.post('/admin/item/all', data)
  .then(res => {
    // Only handle success here
  })
  .catch(err => {
    // 401 errors are already handled globally!
    // Only handle other errors
  })
```

---

## Available Helper Functions

The `apiRequest` helper provides simplified methods:

```javascript
import { apiRequest } from 'src/utils/api-request';

// GET
apiRequest.get('/admin/item/all')

// POST
apiRequest.post('/admin/item/all', { pageNumber: 1, size: 10 })

// PUT
apiRequest.put('/admin/item/update/123', { name: 'New Name' })

// DELETE
apiRequest.delete('/admin/item/delete/123')

// PATCH
apiRequest.patch('/admin/item/patch/123', { active: true })

// With custom config (for file uploads, etc.)
apiRequest.post('/admin/item/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

---

## Migration Examples

### Example 1: Index Page (Dashboard)

**Before:**
```javascript
useEffect(() => {
  axios.defaults.headers = {
    Authorization: auth.token
  }
  axios.post(host + "/wholesale/dashboard/graph/months/", { "year": currentYear })
    .then(res => {
      setCurrentYearDataMonths(res.data);
    })
    .catch(err => {
      let status = (!!err.response ? err.response.status : 0);
      if (status == 401) {
        auth.signOut();
        router.push("/auth/login")
      }
    })
}, [])
```

**After:**
```javascript
import { apiRequest } from 'src/utils/api-request';

useEffect(() => {
  apiRequest.post("/wholesale/dashboard/graph/months/", { year: currentYear })
    .then(res => {
      setCurrentYearDataMonths(res.data);
    })
    .catch(err => {
      console.error('Failed to fetch dashboard data:', err);
    })
}, [currentYear])
```

### Example 2: Items List

**Before:**
```javascript
useEffect(() => {
  const getData = async () => {
    axios.defaults.headers = {
      Authorization: auth.token
    }
    await axios.post(host + "/admin/item/all", { 
      pageNumber: page, 
      size: rowsPerPage 
    })
      .then(res => {
        setItems(res.data.content);
        setTotalElements(res.data.totalElements);
      })
      .catch(err => {
        setMessage(err.message)
      })
  }
  getData();
}, [page, rowsPerPage])
```

**After:**
```javascript
import { apiRequest } from 'src/utils/api-request';

useEffect(() => {
  apiRequest.post("/admin/item/all", { 
    pageNumber: page, 
    size: rowsPerPage 
  })
    .then(res => {
      setItems(res.data.content);
      setTotalElements(res.data.totalElements);
    })
    .catch(err => {
      setMessage(err.message)
    })
}, [page, rowsPerPage])
```

### Example 3: File Upload

**Before:**
```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  axios.defaults.headers = {
    Authorization: auth.token
  }
  
  axios.post(host + '/admin/item/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(res => {
      console.log('Uploaded:', res.data);
    })
    .catch(err => {
      if (err.response?.status === 401) {
        auth.signOut();
        router.push("/auth/login");
      }
    })
}
```

**After:**
```javascript
import { apiRequest } from 'src/utils/api-request';

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  // 401 is handled automatically!
  apiRequest.post('/admin/item/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
    .then(res => {
      console.log('Uploaded:', res.data);
    })
    .catch(err => {
      console.error('Upload failed:', err);
    })
}
```

---

## Current Pages That Already Have 401 Handling

The following pages already check for 401 status. They can continue to work as-is, but you may want to remove the manual 401 checks:

- `src/pages/chat.js` - Has handleUnauthorizedResponse function
- `src/pages/index.js` - Manual 401 check in dashboard API calls
- `src/pages/account.js` - Manual status check
- `src/pages/blocked.js` - Manual status check
- `src/pages/items.js` - Manual status check
- And others...

The interceptor will catch the 401 before these manual checks, so everything continues to work correctly.

---

## Recommended Refactoring Path

1. **Phase 1 (Current):** System is in place, old code continues to work
2. **Phase 2 (Optional):** Gradually migrate high-traffic pages to use `apiRequest` helper
3. **Phase 3 (Optional):** Remove manual 401 checks from components
4. **Phase 4 (Optional):** Clean up manual axios.defaults.headers assignments

---

## Troubleshooting

### 401 Redirect Not Working?

Check that:
1. `initializeApiClient` was called in _app.js ✓
2. Your auth context has a `signOut` method ✓
3. The token is stored in sessionStorage ✓
4. No custom axios instances are bypassing the interceptors

### Need Custom Error Handling?

You can still catch and handle specific errors:

```javascript
apiRequest.get('/some/endpoint')
  .catch(err => {
    if (err.response?.status === 500) {
      // Handle server error
    } else if (err.response?.status === 400) {
      // Handle validation error
    } else if (err.code === 'ECONNABORTED') {
      // Handle timeout
    }
  })
```

### Token Update Issue?

The interceptor reads `authContext.token` on each request. Ensure your auth context updates properly when token changes.

---

## Files Modified/Created

1. **Created:** `src/utils/api-client.js` - Main interceptor setup
2. **Created:** `src/utils/api-request.js` - Helper functions
3. **Modified:** `src/pages/_app.js` - Added ApiClientInitializer

## Summary

✅ All 401 errors now redirect to login automatically
✅ No manual 401 checks needed in components
✅ Authorization headers set automatically
✅ Clean, maintainable code
✅ Easy to add more global error handling in the future
