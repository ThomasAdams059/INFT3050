import React, { useState } from "react";

const RecoverAccount = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="account-container">
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="create-container">
        <div
          className="submit"
          onClick={() => {
            alert(`Recovery email would be sent to: ${email}`);
          }}
        >
          Send Recovery Email
        </div>
        <div
          className="submit gray"
          onClick={() => {
            window.location.href = "/createAccount";
          }}
        >
          Back to Create
        </div>
      </div>
    </div>
  );
};

export default RecoverAccount;
