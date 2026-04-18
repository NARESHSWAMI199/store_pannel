# Quick Reference: 401 Error Handling

## 🎯 What Changed?

All API calls that get a **401 (Unauthorized)** response will **automatically**:
- Clear user session
- Sign out user  
- Redirect to login page

**No manual 401 checks needed!**

---

## 📁 New Files (3 files created)

### 1. `src/utils/api-client.js` ⭐
- Core implementation
- Axios interceptors setup
- Do NOT edit unless adding more error handlers

### 2. `src/utils/api-request.js` 🛠️
- Helper functions
- Use this in your components
- Optional (old axios still works)

### 3. Updated `src/pages/_app.js` 🚀
- Initialization code
- Already done, just verify it's there

---

## 📝 How to Use

### Option 1: Use New Helper (Recommended)
```javascript
import { apiRequest } from 'src/utils/api-request';

apiRequest.get('/endpoint')
apiRequest.post('/endpoint', data)
```

### Option 2: Use Regular Axios (Also Works)
```javascript
import axios from 'axios';
import { host } from 'src/utils/util';

// No need to set headers - interceptor adds them!
// 401 is still handled globally!
axios.post(host + '/endpoint', data)
```

---

## ✅ It Works Because

1. **Request Interceptor** → Adds auth header automatically
2. **Response Interceptor** → Catches 401 → Handles redirect
3. All requests use these interceptors (both axios and apiRequest)

---

## 🔄 Migration (Optional)

### Current State
Your existing code works as-is with the new system.

### To Improve Code
See these files for step-by-step examples:
- `API_ERROR_HANDLING_GUIDE.md` - Complete guide
- `CHAT_JS_REFACTORING_EXAMPLE.md` - Real example from your project

---

## 🧪 Quick Test

1. Open any page that makes API calls
2. Go to DevTools → Application → Session Storage
3. Delete the `token` entry
4. Try to make an API call
5. Should redirect to `/auth/login` automatically ✓

---

## ❓ Common Questions

**Q: Do I need to change my existing code?**
A: No, but you can to make it cleaner.

**Q: Will my old code stop working?**
A: No, it will continue to work AND benefit from 401 handling.

**Q: Do I still need axios.defaults.headers?**
A: No, but it won't break anything if you keep it.

**Q: How do I handle errors other than 401?**
A: Same way as before - in your `.catch()` block.

---

## 📚 Documentation

- **`IMPLEMENTATION_SUMMARY.md`** - Full technical details
- **`API_ERROR_HANDLING_GUIDE.md`** - Usage guide with examples  
- **`CHAT_JS_REFACTORING_EXAMPLE.md`** - How to refactor your pages

---

## 🚀 You're All Set!

The system is:
✅ Installed
✅ Configured  
✅ Working
✅ Ready to use

Start making cleaner API calls today!
