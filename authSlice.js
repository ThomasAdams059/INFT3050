import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// --- Password Hashing Function ---
async function sha256(message) {
  // encode as UTF-8
  const msgBuffer = new TextEncoder().encode(message);
  // hash the message
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  // convert bytes to hex string
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
// ---

// --- API URLs ---
const API_PREFIX_SHORT = "http://localhost:3001"; 
const PATRONS_API_URL = "http://localhost:3001/api/inft3050/Patrons";

// --- Initial State ---
const initialState = {
  user: null, 
  isLoggedIn: false,
  isAdmin: false,
  isPatron: false,
  status: 'idle', 
  error: null,
};

// --- Async Thunks ---

/**
 * 1. LOGIN THUNK (with Patron Workaround)
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // --- PLAN A: Try the official login (for Admins/Employees) ---
      const response = await axios.post(
        `${API_PREFIX_SHORT}/login`, // "http://localhost:3001/login"
        { username, password },
        { withCredentials: true } // This sends the cookie
      );
      
      const isUserLogin = response.data.hasOwnProperty('isAdmin');
      const userData = response.data.user || response.data;

      let isAdmin, isPatron, userType;

      if (isUserLogin) {
        // It's an Admin or Employee
        isAdmin = response.data.isAdmin === true || response.data.isAdmin === 'true';
        isPatron = false;
        userType = isAdmin ? 'admin' : 'employee';
      } else {
        // This block is for patrons IF the /login endpoint *was* working
        isAdmin = false;
        isPatron = true;
        userType = 'patron';
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userType);

      return { user: userData, isAdmin, isPatron };

    } catch (error) {
      // --- PLAN B: Official login failed. Try manual Patron login. ---
      if (error.response && error.response.status === 401) {
        console.warn("Official login failed (401). Attempting manual patron login fallback...");
        
        try {
          // 1. Fetch ALL patrons.
          const patronsResponse = await axios.get(PATRONS_API_URL);
          const patronsList = patronsResponse.data.list;

          if (!patronsList) {
            return rejectWithValue("Patron data could not be loaded.");
          }

          // 2. Find the patron by email
          const patron = patronsList.find(p => p.Email === username);
          if (!patron) {
            return rejectWithValue("Invalid username or password."); // Patron not found
          }

          // 3. Re-create the hash using the fetched salt
          const clientHash = await sha256(patron.Salt + password);

          // 4. Compare hashes
          if (clientHash === patron.HashPW) {
            // 5. SUCCESS! Manually build the user object.
            const userData = patron;
            const isAdmin = false;
            const isPatron = true;
            const userType = 'patron';
            
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('userType', userType);
            
            return { user: userData, isAdmin, isPatron };
          } else {
            return rejectWithValue("Invalid username or password."); // Password mismatch
          }

        } catch (patronError) {
          console.error("Manual patron login failed:", patronError);
          return rejectWithValue(patronError.response?.data?.message || "Login failed. Could not verify patron account.");
        }
      }
      
      const message = error.response?.data?.message || "Invalid username or password.";
      return rejectWithValue(message);
    }
  }
);

/**
 * 2. LOGOUT THUNK
 */
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    try {
      await axios.post(`${API_PREFIX_SHORT}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API call failed, proceeding with client-side logout.", error);
    }
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    return true;
  }
);

/**
 * 3. CHECK STATUS THUNK
 */
export const checkLoginStatus = createAsyncThunk(
  'auth/checkLoginStatus',
  () => {
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (user && userType) {
      const userData = JSON.parse(user);
      return {
        user: userData,
        isAdmin: userType === 'admin',
        isPatron: userType === 'patron',
      };
    }
  }
);


// --- Auth Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.isPatron = false;
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    },
    // --- 1. ADD THE updateUser REDUCER ---
    updateUser: (state, action) => {
      const updatedUserData = action.payload;
      
      // Update state
      state.user = updatedUserData;
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Login Thunk ---
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isLoggedIn = true;
        state.user = action.payload.user;
        state.isAdmin = action.payload.isAdmin;
        state.isPatron = action.payload.isPatron;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // Error message from rejectWithValue
      })
      // --- Logout Thunk ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
        state.isPatron = false;
        state.status = 'idle';
        state.error = null;
      })
      // --- Check Status Thunk ---
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.isAdmin = action.payload.isAdmin;
          state.isPatron = action.payload.isPatron;
          state.isLoggedIn = true;
        }
        state.status = 'idle';
      });
  },
});

export const { logout, updateUser } = authSlice.actions; 
export default authSlice.reducer;

