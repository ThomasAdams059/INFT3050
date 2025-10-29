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
    headers: headers, 
    withCredentials: true
  })
  .then((response) => { 
    console.log("=== USERHELPER DEBUG ===");
    console.log("1. Full axios response:", response);
    console.log("2. response.data:", response.data);
    console.log("3. response.data.isAdmin:", response.data.isAdmin);
    console.log("4. Type of response.data.isAdmin:", typeof response.data.isAdmin);

    // Check for isAdmin in different possible formats
    const isAdmin = response.data.isAdmin === true || 
                    response.data.isAdmin === 'true' ||
                    response.data.isAdmin === 1;

    console.log("5. Extracted isAdmin value:", isAdmin);

    const resultObject = { 
      status: "Success!", 
      isAdmin: isAdmin, 
      user: response.data
    };

    console.log("6. Result object being sent:", resultObject);

    setResult(resultObject);
  }).catch((error) => {
    console.log("=== LOGIN ERROR ===");
    console.log(error);
    setResult({ 
      status: "Error :(", 
      isAdmin: false, 
      error: error.response?.data?.message || "Login failed"
    });
  });
};


// Login Patron or Customer
const tryLoginPatron = (email, password, setResult) => {
  const headers = {
    'Accept': 'application/json',
  };

  console.log("=== PATRON LOGIN ATTEMPT ===");
  console.log("Email:", email);

 axios.get(API_PREFIX_LONG + "/Patrons", {
    headers: headers,
    // withCredentials: true
  })
  .then((response) => {
    console.log("Patrons response:", response.data);

    if (!response.data || !response.data.list) {
      setResult({
        status: "Error :(",
        isAdmin: false,
        error: "Unable to retrieve patron data"
      });
      return;
    }

    const patrons = response.data.list;
    
    // find the patron with matching email case sensitive
    const patron = patrons.find(p => 
      p.Email.toLowerCase() === email.toLowerCase()
    );

    if (!patron) {
      console.log("No patron found with email:", email);
      setResult({
        status: "Error :(",
        isAdmin: false,
        error: "Invalid email or password"
      });
      return;
    }

    console.log("Found patron:", patron);

    // hash the provided password with the patron's salt
    sha256(patron.Salt + password).then((hashedPassword) => {
      console.log("Computed hash:", hashedPassword);
      console.log("Stored hash:", patron.HashPW);

      // compare hashed password with stored hash to ensure proper login
      if (hashedPassword === patron.HashPW) {
        console.log("Password match! Login successful");
        
        const resultObject = {
          status: "Success!",
          isAdmin: false, // Patrons are NEVER admins
          isPatron: true,
          user: {
            UserID: patron.UserID,
            Email: patron.Email,
            Name: patron.Name
          }
        };

        setResult(resultObject);
      } else {
        console.log("Password mismatch!");
        setResult({
          status: "Error :(",
          isAdmin: false,
          error: "Invalid email or password"
        });
      }
    }).catch((error) => {
      console.error("Error hashing password:", error);
      setResult({
        status: "Error :(",
        isAdmin: false,
        error: "Login processing error"
      });
    });

  }).catch((error) => {
    console.log("=== PATRON LOGIN ERROR ===");
    console.log(error);
    setResult({
      status: "Error :(",
      isAdmin: false,
      error: error.response?.data?.message || "Login failed"
    });
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

    //extra steps 
    if (error.response?.status === 401) {
      console.error(" NOT AUTHENTICATED - You must login first!");
      setResult("Fail - Not authenticated");
    } else {
      setResult("Fail");
    }
  });
};

export { tryAddNewUser, tryLoginUser, tryLoginPatron };
