import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser'; 

const RecoverAccount = () => {
  const [email, setEmail] = useState("");
  const form = useRef();

  // state for loading and messages
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  
  const handleSendRecoveryEmail = (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    
    // from EmailJS.com account 
    const YOUR_SERVICE_ID = "service_et6r4hk";
    const YOUR_TEMPLATE_ID = "template_hb5md2k";
    const YOUR_PUBLIC_KEY = "78K8dIEjW-4inJrN4";

    
    const templateParams = {
      to_email: email,
     
      // recovery_link: `http://localhost:3000/reset-password?token=12345`
    };

    emailjs
      .send(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, templateParams, {
        publicKey: YOUR_PUBLIC_KEY,
      })
      .then(
        (response) => {
          console.log('SUCCESS!', response.status, response.text);
          setSuccessMessage(`Recovery email successfully sent to ${email}!`);
          setIsLoading(false);
        },
        (error) => {
          console.log('FAILED...', error);
          setErrorMessage(error.text || 'Failed to send email. Please try again.');
          setIsLoading(false);
        },
      );
  };

  return (
    <div className="account-container">
      {/* wrap inputs in form tags */}
      <form ref={form} onSubmit={handleSendRecoveryEmail}>
        <div className="account-header">
          <div className="account-text">Recover Account</div>
          <div className="underline"></div>
        </div>

        <div className="inputs">
          <div className="input">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              type="email"
              name="to_email" 
              placeholder="Email"
              value={email}
           
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* error ans success messages display */}
        {errorMessage && (
          <div className="error-message" style={{color: 'red', margin: '10px 0', textAlign: 'center'}}>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="success-message" style={{color: 'green', margin: '10px 0', textAlign: 'center'}}>
            {successMessage}
          </div>
        )}

        <div className="create-container">
          <button
            type="submit" 
            className="submit"
            disabled={isLoading}
            style={{opacity: isLoading ? 0.5 : 1}}
          >
            {isLoading ? "Sending..." : "Send Recovery Email"}
          </button>
          <div
            className="submit gray"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            Back to Login
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecoverAccount;