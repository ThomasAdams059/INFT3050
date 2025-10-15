import axios from 'axios';
// API endpoints
const API_PREFIX_SHORT = "http://localhost:3001";
const API_PREFIX_LONG = API_PREFIX_SHORT + "/api/inft3050";

// SHA256 password hashing
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

// Generate a random salt: a 32-character hex string
const generateSalt = () => {
  const salt = window.crypto.randomUUID().replaceAll("-", "");
  //console.log("Salt: ", salt);
  return salt;
};

/* Axios database calls */
// Login user
const tryLoginUser = (username, password, setResult) => {
  // --- HARDCODED ADMIN CHECK (for testing purposes) ---
  // If the admin username is entered, immediately return success and true for isAdmin
  if (username === 'adminAccount') {
    // Simulate a slight delay to mimic network latency
    setTimeout(() => {
        setResult({ status: "Success!", isAdmin: true });
    }, 50);
    return;
  }
  // --- END HARDCODED ADMIN CHECK ---

  const headers = {
    'Accept': 'application/json',
  };
  
  // POST credentials to login
  axios.post(API_PREFIX_SHORT + "/login", { username: username, password: password }, {
    headers: headers, withCredentials: true
  }).then((response) => { 
    console.log(response);

    // Extract isAdmin status from the API response
    // Convert string boolean ('true'/'false') to actual boolean
    const isAdmin = response.data.user?.IsAdmin === 'true'; 

    setResult({ status: "Success!", isAdmin: isAdmin });
  }).catch((error) => {
    console.error("Login Error:", error);
    setResult({ status: "Error :(", isAdmin: false });
  });
};

// Add new user
const tryAddNewUser = async (fullName, email, password, address, postcode, state, setResult) => {
  const headers = {
    'Accept': 'application/json',
  };
  
  const salt = generateSalt();
  const hashedPW = await sha256(salt + password);
  
  const newCredentials = {
    UserName: fullName, // Use FullName for UserName for simplicity (based on login changes)
    Email: email,
    Address: address,
    PostCode: postcode,
    State: state,
    IsAdmin: "false",
    Salt: salt,
    HashPW: hashedPW,
    Name: fullName // Using FullName as Name
  };

  axios.post(API_PREFIX_LONG + "/User", newCredentials, {
    headers: headers,
    withCredentials: true
  }).then(response => {
    console.log("Added user successfully", response);
    setResult("Success");
  }).catch(error => {
    console.error('Error posting data:', error);
    setResult("Fail");
  });
};

export { tryAddNewUser, tryLoginUser };
