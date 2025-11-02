import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// same as userhelper
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

const API_PREFIX_SHORT = "http://localhost:3001"; 
const PATRONS_API_URL = "http://localhost:3001/api/inft3050/Patrons";


const initialState = {
  user: null, 
  isLoggedIn: false,
  isAdmin: false,
  isPatron: false,
  status: 'idle', 
  error: null,
};



// login for users and with patron work around ----- see below
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // login for users like admin and employees
      const response = await axios.post(
        `${API_PREFIX_SHORT}/login`, // 
        { username, password },
        { withCredentials: true } // cookie
      );
      
      const isUserLogin = response.data.hasOwnProperty('isAdmin');
      const userData = response.data.user || response.data;

      let isAdmin, isPatron, userType;

      if (isUserLogin) {
        // if it is an admin or employee
        isAdmin = response.data.isAdmin === true || response.data.isAdmin === 'true';
        isPatron = false;
        userType = isAdmin ? 'admin' : 'employee';
      } else {
        // for patrons login
        isAdmin = false;
        isPatron = true;
        userType = 'patron';
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userType', userType);

      return { user: userData, isAdmin, isPatron };

    } catch (error) {
      // try manual patron login if fails
      if (error.response && error.response.status === 401) {
        console.warn("Official login failed (401). Attempting manual patron login fallback...");
        
        try {
          // gets all Patrons
          const patronsResponse = await axios.get(PATRONS_API_URL);
          const patronsList = patronsResponse.data.list;

          if (!patronsList) {
            return rejectWithValue("Patron data could not be loaded.");
          }

          // finds patron by email
          const patron = patronsList.find(p => p.Email === username);
          if (!patron) {
            return rejectWithValue("Invalid username or password."); // Patron not found
          }

          // remakes the hash
          const clientHash = await sha256(patron.Salt + password);

          // 4. Compare hashes
          if (clientHash === patron.HashPW) {
            // manually makes the user object
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

//logout 
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

// chekc status
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
    // add updateUser
    updateUser: (state, action) => {
      const updatedUserData = action.payload;
      
      // upadtes state
      state.user = updatedUserData;
      
      // updates localstorage
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    }
  },
  extraReducers: (builder) => {
    builder
      // login
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
        state.error = action.payload; // error message from rejectWithValue for debugginh
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.isAdmin = false;
        state.isPatron = false;
        state.status = 'idle';
        state.error = null;
      })
      // check status
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
