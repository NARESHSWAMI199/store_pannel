/**
 * EXAMPLE: chat.js Refactoring
 * 
 * This shows how to refactor API calls in chat.js to use the new centralized
 * 401 error handling. You don't need to apply all changes at once - do it incrementally.
 */

// ============================================================================
// BEFORE: Current Implementation with Manual 401 Handling
// ============================================================================

// Old - Manual 401 handling in multiple places
const OLD_fetchUserBySlug = async (slug, token) => {
    try {
        const response = await axios.get(`${host}/wholesale/auth/detail/${slug}`, {
            headers: { Authorization: token }
        });
        return response.data.user
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // Manual 401 redirect - not needed anymore!
            router.push('/auth/login');
        }
        return null;
    }
};

// Old - fetchChatUsers with manual header setup
const OLD_fetchChatUsers = (receiver, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.post(`${host}/chats/all`, { receiver: receiver.slug })
        .then(res => {
            setChatUsers(res.data);
        })
        .catch(err => {
            // Manual error handling for each API call
            if (err.response && err.response.status === 401) {
                router.push('/auth/login');  // Duplicated code!
            }
        })
}

// Old - fetchChatStatus with similar pattern
const OLD_fetchChatStatus = (chatUser, token) => {
    axios.defaults.headers = { Authorization: token };
    axios.get(`${host}/chat/status/${chatUser.slug}`)
        .then(res => {
            // handle response
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                router.push('/auth/login');  // Duplicated again!
            }
        })
}

// ============================================================================
// AFTER: Refactored with Centralized Error Handling
// ============================================================================

import { apiRequest } from 'src/utils/api-request';

// New - No manual 401 handling needed
const NEW_fetchUserBySlug = async (slug) => {
    try {
        // 401 is handled automatically by interceptor!
        const response = await apiRequest.get(`/wholesale/auth/detail/${slug}`);
        return response.data.user
    } catch (error) {
        console.error('Error fetching user:', error);
        // Only handle other errors, 401 is already handled globally
        return null;
    }
};

// New - Clean and simple
const NEW_fetchChatUsers = (receiver) => {
    apiRequest.post(`/chats/all`, { receiver: receiver.slug })
        .then(res => {
            setChatUsers(res.data);
        })
        .catch(err => {
            console.error('Failed to fetch chat users:', err);
            // 401 already handled, only handle other errors
        })
}

// New - Same pattern
const NEW_fetchChatStatus = (chatUser) => {
    apiRequest.get(`/chat/status/${chatUser.slug}`)
        .then(res => {
            // handle response
        })
        .catch(err => {
            console.error('Failed to fetch chat status:', err);
            // 401 already handled, only handle other errors
        })
}

// ============================================================================
// MIGRATION CHECKLIST for chat.js
// ============================================================================

/*
1. At the top of the file, add:
   import { apiRequest } from 'src/utils/api-request';

2. Replace all axios calls:
   - axios.get() → apiRequest.get()
   - axios.post() → apiRequest.post()
   - axios.put() → apiRequest.put()
   - axios.delete() → apiRequest.delete()

3. Remove all axios.defaults.headers assignments:
   - DELETE: axios.defaults.headers = { Authorization: token };

4. Remove all manual 401 checks:
   - DELETE: if (error.response?.status === 401) { router.push(...) }

5. Remove the handleUnauthorizedResponse helper function (no longer needed)

6. Simplify catch blocks to only handle non-401 errors

Example Change 1: fetchUserBySlug
   Line 58: axios.get(`${host}/wholesale/auth/detail/${slug}`, {...})
   Replace with: apiRequest.get(`/wholesale/auth/detail/${slug}`)
   Remove the manual 401 check

Example Change 2: Delete chat message
   Line 427: axios.post(`${host}/chat/delete`, deleteParams, {...})
   Replace with: apiRequest.post(`/chat/delete`, deleteParams)
   Remove error handling for 401

Example Change 3: fetchChatUsers
   Line 1336-1337: axios.defaults.headers + axios.post()
   Replace with: apiRequest.post(`/chats/all`, { receiver: receiver.slug })
   Remove 401 check

Example Change 4: fetchContactUsers
   Line 1371-1372: axios.defaults.headers + axios.get()
   Replace with: apiRequest.get(`/contacts/all`)
   Remove 401 check

Example Change 5: uploadMessage with FormData
   Line 1459-1463: Need to keep config for Content-Type
   Replace with: apiRequest.post(`/chat/upload`, messageBody, {
     headers: { 'Content-Type': 'multipart/form-data' }
   })
   Remove 401 check
*/

// ============================================================================
// STEP-BY-STEP: First Refactoring for chat.js
// ============================================================================

import axios from 'axios';
import { apiRequest } from 'src/utils/api-request';
import { host, userImage, wbhost, defaultChatImage } from 'src/utils/util';
import { useAuth } from 'src/hooks/use-auth';
import { useRouter } from 'next/router';

function Page() {
    const router = useRouter();
    const auth = useAuth();
    const token = auth.token;

    // CHANGE 1: fetchUserBySlug - Remove manual 401 handling
    const fetchUserBySlug = async (slug) => {
        try {
            // Just use apiRequest - no headers, no 401 check needed
            const response = await apiRequest.get(`/wholesale/auth/detail/${slug}`);
            return response.data.user
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    // CHANGE 2: Delete chat - Simpler error handling
    const deleteChat = async (deleteParams) => {
        try {
            const response = await apiRequest.post(`/chat/delete`, deleteParams);
            return response.data;
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error('Failed to delete chat:', error);
            }
            // 401 errors are handled automatically
        }
    };

    // CHANGE 3: fetchChatUsers - Clean and simple
    const fetchChatUsers = (receiver) => {
        apiRequest.post(`/chats/all`, { receiver: receiver.slug })
            .then(res => {
                setChatUsers(res.data);
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch chat users:', err);
                }
            })
    }

    // CHANGE 4: fetchChatStatus - Simple GET
    const fetchChatStatus = (chatUser) => {
        apiRequest.get(`/chat/status/${chatUser.slug}`)
            .then(res => {
                // handle status
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch status:', err);
                }
            })
    }

    // CHANGE 5: fetchContactUsers
    const fetchContactUsers = () => {
        apiRequest.get(`/contacts/all`)
            .then(res => {
                setContactUsers(res.data);
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch contacts:', err);
                }
            })
    }

    // CHANGE 6: fetchChatRooms
    const fetchChatRooms = () => {
        apiRequest.get(`/chat-users/all`)
            .then(res => {
                // handle
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to fetch chat rooms:', err);
                }
            })
    }

    // CHANGE 7: markChatSeen
    const markChatSeen = () => {
        apiRequest.post(`/chat/seen`, { sender: receiver?.slug })
            .then(() => {
                // mark as seen
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to mark as seen:', err);
                }
            })
    }

    // CHANGE 8: uploadMessage - Keep config for multipart
    const uploadMessage = (messageBody) => {
        apiRequest.post(`/chat/upload`, messageBody, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(response => {
                // handle upload
            })
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Upload failed:', err);
                }
            })
    }

    // CHANGE 9: getLastSeen
    const getLastSeen = () => {
        return apiRequest.get(`/wholesale/auth/last-seen`)
            .catch(err => {
                if (err.response?.status !== 401) {
                    console.error('Failed to get last seen:', err);
                }
            })
    }

    // CHANGE 10: sendMessage - Create parentId
    const sendMessage = async (message) => {
        try {
            const parentId = await apiRequest.post(`/chats/parentId`, message)
            return parentId;
        } catch (err) {
            if (err.response?.status !== 401) {
                console.error('Failed to send message:', err);
            }
        }
    }

    // Rest of component unchanged...
}
