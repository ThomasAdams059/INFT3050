import React, {useState} from "react";

const Login = () => {

   const [action, setAction] = useState("Login");


    const renderLoginForm = () => (
        <div className = 'account-container'>
            <div className="account-header">
                <div className='account-text'>Log In</div> 
                <div className='underline'></div>  
            </div> 
            
            <div className='inputs'>
                <div className='input'>
                    <label htmlFor="email">Email*</label>
                    <input id="email" type='email' placeholder = "Email"/>
                </div>

                <div className='input'>
                    <label htmlFor="password">Password*</label>
                    <input id="password" type='password'placeholder= "Password"/>
                </div>
            </div>
            
            <div className = "forgot-password">
                    <span> 
                    <a href="/recoverAccount">Lost Password? Click Here!</a>
                    </span>
                </div>
            
            <div className='create-container'>
                <div className="submit" onClick={() => setAction("Login")}>Log In</div>
                <div className="submit gray" onClick={() => setAction("Create Account")}>Create Account</div>
            </div>
        </div>
    );


    const renderCreateAccountForm = () => (
        <div className = 'account-container'>
            <div className="account-header">
                <div className='account-text'>Create Account</div> 
                <div className='underline'></div>  
            </div> 
            
            <div className='inputs'>
                <div className='input'>
                    <label htmlFor="name">Full Name*</label>
                    <input id="name" type='text' placeholder="Full Name"/>
                </div>
                <div className='input'>
                    <label htmlFor="email">Email*</label>
                    <input id="email" type='email' placeholder="Email"/>
                </div>
                <div className='input'>
                    <label htmlFor="password">Password*</label>
                    <input id="password" type='password' placeholder="Password"/>
                </div>

                <div className='input'>
                    <label htmlFor="address">Address*</label>
                    <input id="address" type='text' placeholder="Address" />
                </div>

                <div className='input'>
                    <label htmlFor="postcode">Post Code*</label>
                    <input id="postcode" type='number' placeholder = "Post Code"/>
                </div>

                <div className='input'>
                <label htmlFor="state">State*</label>
            
                    <select id="state">
                    <option value="">State</option>
                    <option>NSW</option>
                    <option>VIC</option>
                    ...
                    </select>
                </div>
            
            </div>
                <div className = "forgot-password">
                    <span> 
                    <a href="/recoverAccount">Lost Password? Click Here!</a>
                    </span>
                </div>
            <div className='create-container'>
                <div className="submit gray" onClick={() => setAction("Login")}>Log In</div>
                <div className="submit" onClick={() => setAction("Create Account")}>Create Account</div>
            </div>
        </div>
    );

    // Conditional rendering based on the `action` state
    return (
        <>
            {action === "Login" ? renderLoginForm() : renderCreateAccountForm()}
        </>
    );
}

export default Login;
