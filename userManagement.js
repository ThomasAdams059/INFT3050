mystic_banana_bread
mystic_banana_bread
In a call

mystic_banana_bread — Yesterday at 12:14 PM
boot them all
I dont have permissions to remove people
if you get a chance dom please get rid of everyone theres 6 extra random people and youre the admin banish them
Adams ™ — 9:14 AM
@mystic_banana_bread call around 10:15 ish?
mystic_banana_bread — 10:14 AM
I just woke up oops
Do the week 12 lab I’ll get ready
Tell me what you get if there’s an error or not
Also I texted one of the dudes I used to know in uni well I still know him but don’t really talk to him
He said the only issue with the patron pages is authentication not user creation ? So I think we are dumb
Adams ™ — 10:17 AM
i havent even looked at the backend for the patron pages dont call me dumb
but currently doing stats for our basketball video
will do week 12 lab after that if you arent ready yet
mystic_banana_bread — 10:49 AM
ready
did you try to change the compose.yml file?
Adams ™ — 10:57 AM
nah not yet I only just got back to my desk, gonna really quickly eat something for 10 mins then I'll be good to lock in
Dominic W — 11:02 AM
💯
Adams ™ — 11:21 AM
ready to lock in?
mystic_banana_bread — 11:22 AM
ive been ready for 20 mins
Adams ™ — 11:22 AM
well i was up at 10 waiting so touche
Adams ™
 started a call that lasted 3 hours. — 11:22 AM
mystic_banana_bread — 11:32 AM
Image
mystic_banana_bread — 11:40 AM
import { useState } from "react";
import axios from 'axios';


const UserManagement = () => {
  
Expand
message.txt
14 KB
Adams ™
 removed 
mystic_banana_bread
 from the group. — 11:51 AM
Adams ™
 added 
mystic_banana_bread
 to the group. — 11:51 AM
Adams ™ — 11:51 AM
my bad
mystic_banana_bread — 11:52 AM
wow
Dominic W — 11:59 AM
Bro someone just joined the postman, I thought i set it to invite only so idk how they're getting in
I removed them
mystic_banana_bread — 11:59 AM
thanks
Dominic W — 11:59 AM
But wth is old mate only just connecting to post man the week that ts is due
mystic_banana_bread — 11:59 AM
lmao
what was the name
do we know
Dominic W — 12:00 PM
Ben walker
mystic_banana_bread — 12:05 PM
compose docker up -d
docker compose up -d : right one
mystic_banana_bread — 12:31 PM
be right back
mystic_banana_bread — 12:45 PM
me back
Adams ™ — 12:45 PM
oki im still working on the authors page
Dominic W — 1:14 PM
Im gonna go on my break soon, what would u guys like me to do?
mystic_banana_bread — 1:14 PM
help me with postman?
import React, { useState } from "react";
import { tryLoginUser } from './helpers/userHelpers';

const Login = ({ onLogin }) => {
  //const [action, setAction] = useState("Login");
  const [username, setUsername] = useState("");
Expand
message.txt
3 KB
username: adminAccount
password : adminPW
Adams ™ — 1:18 PM
admin login works
authors page also implemented correctly now
mystic_banana_bread — 1:19 PM
import { useState } from "react";
import axios from 'axios';


const UserManagement = () => {
  
Expand
message.txt
14 KB
userManagement.js
Dominic W — 1:36 PM
Some kids just pissed in my store...
Killing myself
mystic_banana_bread — 1:36 PM
wth lmao
Adams ™ — 1:37 PM
Dom Orpi's postman get requests work for some now but when she tries user list she gets this error
mystic_banana_bread — 1:37 PM
Image
Adams ™ — 1:37 PM
any idea if its related to postman permissions? Like something you could assign as the admin?
or is it something else random
Dominic W — 1:38 PM
If u hover over 401 unauthorised, it will tell you what the issue is
mystic_banana_bread — 1:47 PM
import axios from 'axios';
// API endpoints
const API_PREFIX_SHORT = "http://localhost:3001";
const API_PREFIX_LONG = API_PREFIX_SHORT + "/api/inft3050";

// SHA256 password hashing
Expand
message.txt
4 KB
Dominic W — 1:48 PM
Wth is this file u keep sending
Adams ™ — 1:48 PM
sending it to me bro
to update my code
to test stuff
Dominic W — 1:49 PM
Ah
mystic_banana_bread — 1:51 PM
dom do you remember where we got the admin login information in postman?
Dominic W — 1:52 PM
Login i think
Dominic W — 2:23 PM
Any updates to tithub?
mystic_banana_bread — 2:26 PM
nope
oh tom should he made the author page functional with get requests but I still cannot get post request working
changed your login and userHelper.js to not do hardcheck for admin account name
but admin status is still wrong something to do with postman I think but debugging rn
Dominic W — 2:33 PM
Hmm
mystic_banana_bread — 2:55 PM
admin status always shows false so we are not logging in as admin something to do with the backend
Image
Dominic W — 2:56 PM
Im so confused
mystic_banana_bread — 2:59 PM
so in the login code you made it was hardcoded to see if the account name matches adminAccount then we are redirected to the adminAccount page but I changed it so that it actually checks the login info. In app.js you set it up as that if we use the login function (which we now do), it will check the isAdmin status, if it is true, we can go to the adminAccount page if not we are redirected to account settings page
Dominic W — 3:00 PM
oh right okay
mystic_banana_bread — 3:00 PM
did you know you hardcoded the admin login check?
Dominic W — 3:00 PM
yes i thought it was the only admin user
mystic_banana_bread — 3:01 PM
there is another one called bob but we dont know his password, but regardless its set up like that that user creation using POST requests only works with the backend if youre logged in as an admin
but rn admin status is false so even tho its seeing that the password and username is correct its still not recognising it properly idky
Dominic W — 3:02 PM
ohhh okay
upload ur updated login to github so i can have a look
mystic_banana_bread — 3:03 PM
okay
Dominic W — 3:04 PM
good job finding that, i didnt even think to look at the user list to see if there was another admin
mystic_banana_bread — 3:05 PM
i added login and userhelper
because both use the hardcoded check
mystic_banana_bread — 3:07 PM
tom found that, but doesnt matter, we need authentication from database as an admin to be able to do post requests for user creation thats how they set up the databse, so we cannot just manually go to the admin settings
Dominic W — 3:08 PM
righto
so after your update logging in as adminAccount goes to accountsettings page
is that correct?
mystic_banana_bread — 3:10 PM
yeah
Dominic W — 3:13 PM
okay
why
mystic_banana_bread — 3:14 PM
because admin status is false
Adams ™ — 3:17 PM
And your code Dom uses a check where if admin is true go to admin page, if false go to account settings
In the function that handles the navigation for the login button
mystic_banana_bread — 3:17 PM
yeah
okay wait
we arent the only ones
nicks got the same issue as me
somethings wrong with the database idk what to do neither does he
Adams ™ — 3:18 PM
hop back in call?
mystic_banana_bread — 3:18 PM
nicks the dude i was friends with in first sem
okay
gimme a sec
Adams ™
 started a call that lasted 39 minutes. — 3:18 PM
Dominic W — 3:19 PM
yeah i know
mystic_banana_bread — 3:22 PM
we cannot log in as an admin
to be able to create a user you need to be able to login as an admin
so cannot create users
cannot update users, cannot delete users
we can get
no patch no delete
so no item management
Hi All, 

I am just putting you all in the same email thread as you all seem to be getting similar/the same error code. 

I've been up all night trying to find the error in the back-end and I have tried to replicate the error on my end, but it does not seem to effect the app on my side. 

I know this is hugely stressful and highly inconvenient - I've seen most of your work thus far so rest assured if this truly a back-end thing that I cannot fix by due date I wont take off marks (and we can talk extensions if needed). 

In the meantime, you send me screenshots of the errors, your docker set up, and the JS code that was written? 

I'd recommend to just keep coding like you have access to the back-end - just put a comment around it so I know its either untested/not connected. Worst case scenario, I can mark off that and the knowledge that I have of your apps thus far. 

I will keep you updated as I work to get this sorted out and I apologise for the stress and inconvenience, this is that tricky part of this kind of development, because no two solutions are the same the blanket solution doesn't work for everyone. 

I do know that you don't need the auth folder anymore - having this causes more issues as this is now handled by the backend. Other than that I will keep digging and if you can send me the screenshots I can double check everything from my side. 

I will keep you posted - I know Mac and Nick have done their demos but Haeun we can always postpone yours if we don't have this sorted out by next Thursday.

Kind regards, 

Jacqueline
Dominic W — 3:29 PM
great email
Adams ™ — 3:30 PM
Cannot login as admin
Cannot login as users
Cannot create users
Cannot update users
Cannot delete users
No item management
No PATCH, no DELETE
 
mystic_banana_bread — 3:40 PM
@Dominic W can you follow the week 9 lab for deleting auth folder, and then changing the build./auth to the image (which I know you have already done but do it again please) and then use the updated code and try to see if you can then login as an admin, and then are able to get to adminAccount page instead of acc settings page
let me know, because the new image worked for you but I remember you did not delete the auth folder when I asked you last thursday
mystic_banana_bread — 3:58 PM
@Dominic W can you please sit in a call tonight after you get back, because I think you may be actually able to talk to the database
Dominic W — 5:13 PM
👍
Dominic W — 6:30 PM
This is a backend API bug, not a problem with your React frontend code. You cannot fix this from your React application.

The error message Cannot insert explicit value for identity column in table 'Patrons' means the backend code is trying to manually set a UserID (e.g., UserID: 10) when it creates a new user in the Patrons table.

The database is configured to automatically generate this UserID for every new user, so it's rejecting the manual value.

How to Fix It (For the Backend Developer)
The developer of the backend API (the auth service) needs to change their code.

They must find the SQL query that inserts a new user into the [dbo].[Patrons] table and remove the UserID column and its value from the INSERT statement.

Example of the bug:

-- WRONG (This is what the backend is probably doing)
INSERT INTO [dbo].[Patrons] (UserID, Email, Name, Salt, HashPW) 
VALUES (5, 'test@email.com', 'Test User', '...', '...'); 


Example of the fix:

-- RIGHT (This is what the backend *should* be doing)
INSERT INTO [dbo].[Patrons] (Email, Name, Salt, HashPW) 
VALUES ('test@email.com', 'Test User', '...', '...');


By removing UserID from the query, the database will automatically assign the next available ID, and the error will be resolved.

there is nothing we can do...
Image
we do not have access to the auth folder
mystic_banana_bread — 6:31 PM
Yeah I know
That’s what I was saying lol
Dominic W — 6:31 PM
Yeah but I already said this to you last week
mystic_banana_bread — 6:32 PM
Yeah but then jaq said she fixed it
Some people can still use the fix to do it
I couldn’t so I thought maybe something on my end is wrong
But you could run the docker compose commands with the updated compose.yml file
So thought maybe if you got rid of the auth folder like they said in week 9 and because I’m the email jaq said having the auth folder causes more issues, I thought you could delete it and then run the docker compose up and down commands and see if you can access
Dominic W — 6:36 PM
yeah i did that
in week 9...
mystic_banana_bread — 6:36 PM
I asked you last week and you said you didn’t delete anything 😭😭
Dominic W — 6:37 PM
yeah last week i didn't but you making me go through lab 9 again made me remember it
mystic_banana_bread — 6:37 PM
Oh well we tried
mystic_banana_bread — 6:37 PM
Fair
Okay we just keep writing the code as if we can access it
Dominic W — 6:38 PM
i dont understand how every single get command is fucked
mystic_banana_bread — 6:38 PM
We may have to get rid of the logic where if isAdmin status is false we go to account settings
And always make it navigate to admin account page
mystic_banana_bread — 6:39 PM
Wdym
They are working post isn’t working
Dominic W — 6:39 PM
sorry i mean post
all of them except for login and logout
make it make sense
mystic_banana_bread — 6:40 PM
Oh right yeah
Apparently we can do successful get requests for users don’t know how because we have no users
mystic_banana_bread — 6:41 PM
Get requests are easier because nothing is getting changed but post and patch you need to make changes
Dominic W — 6:41 PM
there are 5 users
mystic_banana_bread — 6:42 PM
Ohhh yes I forgot lol
Dominic W — 9:02 PM
orpi i ready
Dominic W — 9:47 PM
tom u special needs, u deleted app.js when you were deleting all ur mobile app stuff
Adams ™ — 9:48 PM
Bruh I saw halfway through that an occasional website file was mixed in to the app ones for some reason
But just upload it again you’ll be right
Dominic W — 9:48 PM
yes
﻿
import { useState } from "react";
import axios from 'axios';


const UserManagement = () => {
  
  // base url for api endpoints like products and genre page
  const baseUrl = "http://localhost:3001/api/inft3050";
  // Add User state
  const [userName, setUserName] = useState(""); // stores user inout value
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(""); // stores email
  const [password, setPassword] = useState(""); //stores passwords
  const [address, setAddress] = useState(""); //addresses
  const [postCode, setPostCode] = useState(""); //postcode
  const [state, setState] = useState("NSW"); //state

  // Edit/Delete User state
  const [searchUser, setSearchUser] = useState(""); //stores username being searched for
  const [showUserInfo, setShowUserInfo] = useState(false); // Tom Changed to true - changed back to false - boolean to control if user info section is visible
  
  // new addition 
   const [foundUser, setFoundUser] = useState(null); //stores the user returned from search
  
  // loading state during operations 
  const [isLoading, setIsLoading] = useState(false);

  // error message display
   const [errorMessage, setErrorMessage] = useState("");

   // success message display
   const [successMessage, setSuccessMessage] = useState("");



   // same function used in userHelper.js to convert plain tect password in secure hash
   async function sha256(message) {
      // encode as UTF-8
      const msgBuffer = new TextEncoder().encode(message);
      // hash the message
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      // convert ArrayBuffer to Array
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      // convert bytes to hex string
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex; // returns the final hash as a hex string
}

  // same as in userHelper.js - Generate a random salt: a 32-character hex string
  const generateSalt = () => {
    const salt = window.crypto.randomUUID().replaceAll("-", "");
    //console.log("Salt: ", salt);
    return salt;
  };

  // handle Add User form submission to create a new user in thr database 

   // Handle Add User
  const handleAddUser = (event) => {
    event.preventDefault();

    // sets loading state to true 
    setIsLoading(true);

    // clears any previous error or success messsage
    setErrorMessage("");
    setSuccessMessage("");
    
    // generates a unique salt for user
    const salt = generateSalt();

    // returns a primise so then() is used to handle it
    sha256(salt + password).then((hashedPW) => {

      // creates object with database fields that exist
      const newUser = {
        UserName: userName,
        Email: email,
        Name: fullName,
        IsAdmin: 0, // only another user not admin as only one admin
        Salt: salt,
        HashPW: hashedPW,
        Address: address,      
        PostCode: postCode,    
        State: state
      };

      // makes POST request to add user to database then uses then() catch() pattern
      axios.post(
        `${baseUrl}/User`,
        newUser,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        }
      )
      .then((response) => {
        console.log("User added successfully:", response.data);
        setSuccessMessage(`User "${userName}" created successfully!`);

        // clears the form after
        setUserName("");
        setFullName("");
        setEmail("");
        setPassword("");
        setAddress("");
        setPostCode("");
        setState("NSW");

        // sets loading back to false
        setIsLoading(false);
      })

      .catch((error) => {
        // if somethng goes wrong error message for that added 
        console.error("Error adding user:", error);

        // more detailed error message logging to understand
        const errorMsg = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Failed to create user. Please try again.";
        setErrorMessage(errorMsg);
        setIsLoading(false);
      });

    })
    .catch((error) => {
     console.error("Error hashing password:", error);
      setErrorMessage("Failed to process password. Please try again.");
      setIsLoading(false);
    });
  }; 

   // SEARCH USER 

  // Handle Search User
  const handleSearchUser = (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    setShowUserInfo(false); //changed from true

    axios.get(
      `${baseUrl}/User`,
      {
        headers: {
          'Accept': 'application/json'
        },
        withCredentials: true 
      }
    )

    .then((response) => {
      const users = response.data.list; //array like handleAddUser

      // searches for user converting it to lowercase for case sensitivity
      const user = users.find(u =>
        u.UserName.toLowerCase()=== searchUser.toLowerCase() 
      );

      if (user) {
        // user found and is stored
        setFoundUser(user);

        // show user info section
        setShowUserInfo(true); // now its true

        // success message
        setSuccessMessage(`Found user: ${user.UserName}` 
        ); 

      }
      
      else { setErrorMessage(`User "${searchUser}" not found`);
        // clears the user and hides info again
        setFoundUser(null);
        setShowUserInfo(false);
      }

      setIsLoading(false);
    })
    .catch((error) => {
      console.error("Error searching user:", error);
      setErrorMessage("Failed to search for user. Please try again.");
      setIsLoading(false); 
    })
  };


  //EDIT USER


  // Handle Edit User
  const handleEditUser = () => {
    // no user then exit
    if (!foundUser) 
      return;

    const newName = prompt("Enter new full name:", foundUser.Name);
    const newEmail = prompt("Enter new email:", foundUser.Email);

    // if any fields are emtpy error displayed
    if (!newName || !newEmail) {
      alert("All fields are needed.")
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // changes or upadtes the new values
    const updatedUser = {
      ...foundUser, //copy all existing properties
      Name: newName,
      Email: newEmail
    };

    axios.put(
      `${baseUrl}/User/${foundUser.ID}`,
      updatedUser,                         // Request body (updated user data)
      {
        headers: { 
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    )
    .then((response) => {
       console.log("User updated successfully:", response.data);
      setSuccessMessage(`User "${foundUser.UserName}" updated successfully!`);

      // update the user info to display
      setFoundUser(updatedUser);

      // back to false
      setIsLoading(false);
    })

    .catch((error) => {

      console.error("Error updating user:", error);
      const errorMsg = error.response?.data?.message || "Failed to update user. Please try again.";
      setErrorMessage(errorMsg);

      setIsLoading(false);
    });
  };

  // Handle Delete User
  const handleDeleteUser = () => {

    if (!foundUser) return;

    const confirmDelete = window.confirm(`Are you sure you want to delete user "${foundUser.UserName}"? This action cannot be undone.`
    );

    if (!confirmDelete) return;
    setIsLoading(true);
    
    // Clear messages
    setErrorMessage("");
    setSuccessMessage("");
    
    axios.delete(
      `${baseUrl}/User/${foundUser.ID}`,  
      {
        headers: { 
          'Accept': 'application/json'
        },
        withCredentials: true
      }
    )

    .then((response) => {
      console.log("User deleted successfully");
      setSuccessMessage(`User "${foundUser.UserName}" deleted successfully.`);

      setShowUserInfo(false);
      setFoundUser(null);
      setSearchUser("");
      setIsLoading(false);
    })

    .catch((error) => {
      console.error("Error deleting user:", error);
      const errorMsg = error.response?.data?.message || "Failed to delete user. Please try again.";
      setErrorMessage(errorMsg);
      setIsLoading(false);

    })
  };

  return (
    <div className="management-container">
      <h1>User Management</h1>
      
      {/* Display Messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      
      <div className="management-grid">
        {/* Add User Section */}
        <div className="management-section">
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div className="form-group">
              <label>
                Username<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Full Name<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="First and Last"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email<span className="required">*</span>
              </label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Password<span className="required">*</span>
              </label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                Address<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Post Code"
                  value={postCode}
                  onChange={(e) => setPostCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <select value={state} onChange={(e) => setState(e.target.value)}>
                  <option value="NSW">NSW</option>
                  <option value="VIC">VIC</option>
                  <option value="QLD">QLD</option>
                  <option value="SA">SA</option>
                  <option value="WA">WA</option>
                  <option value="TAS">TAS</option>
                  <option value="NT">NT</option>
                  <option value="ACT">ACT</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-add" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>

        {/* Edit/Delete User Section */}
        <div className="management-section">
          <h2>Edit/Delete User</h2>
          <form onSubmit={handleSearchUser} className="search-box">
            <label>
              Search Username<span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Search for user"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              required
            />
            <button type="submit" className="btn-search" disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {showUserInfo && foundUser && (
            <>
              <div className="user-info">
                <h3>User Info</h3>
                <p><strong>Username:</strong> {foundUser.UserName}</p>
                <p><strong>Full Name:</strong> {foundUser.Name}</p>
                <p><strong>Email Address:</strong> {foundUser.Email}</p>
              </div>

              <div className="button-row">
                <button className="btn-edit" onClick={handleEditUser} disabled={isLoading}>
                  Edit User
                </button>
                <button className="btn-delete" onClick={handleDeleteUser} disabled={isLoading}>
                  Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
message.txt
14 KB
