import React, {useState} from "react";



 
  const CreateAccount = () => {
   const [action, setAction] = useState("Create Account");
    return (
        <div className = 'account-container'>
        <div className="account-header">
            <div className='account-text'>{action}</div> 
            <div className='underline'></div>  
        </div> 
        
        <div className='inputs'>
        <div className='input'>
            <label htmlFor="fullName">Name*</label>
            <input id='fullName' type='text' placeholder="First and Last Name"/>
        </div>

        <div className='input'>
            <label htmlFor="email">Email*</label>
            <input id="email" type='email' placeholder = "Email"/>
        </div>

        <div className='input'>
            <label htmlFor="oassword">Password*</label>
            <input id="password" type='password'placeholder= "Password"/>
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
        
        <div className='create-container'>
            <div className={action==="Recover Account"?"submit gray":"submit"} onClick={()=>{setAction("Create Account")}}>Create Account</div>
            <div className={action==="Create Account"?"submit gray":"submit"}onClick={()=>{window.location.href="/recoverAccount";}}>Recover Account</div>
        </div>

        
        </div>
    )
  }

  export default CreateAccount;