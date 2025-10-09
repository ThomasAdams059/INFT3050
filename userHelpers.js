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
  const headers = {
    'Accept': 'application/json',
  };
  // POST credentials to login
  axios.post(API_PREFIX_SHORT + "/login", { username: username, password: password }, {
    headers: headers, withCredentials: true
  }).then((response) => { // Success
    console.log(response);
    setResult("Success!");
  }).catch((error) => {
    console.log(error);
    setResult("Error :(");
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
    FullName: fullName,
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