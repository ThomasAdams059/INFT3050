import React, { useState} from 'react';

const AddressBook = () => {
    const [address, setAddress] = useState("");
    const [postcode, setPostcode] = useState("");
    const [state, setState] = useState("");

    /* Handle adding a new address - currently just a placeholder for the button to work */
    const handleRecoverClick = () => {
    window.location.href = "/recoverAccount";
  };

  // Helper function for navigation
  const navigate = (path) => {
      window.location.href = path;
  };

  // Links for the sidebar
  const sidebarLinks = [
      { name: 'Account Dashboard', path: '/myAccount' },
      { name: 'Order History', path: '/orderHistory' },
      { name: 'Account Settings', path: '/accountSettings' },
      { name: 'Address Book', path: '/addressBook' },
      { name: 'Payment Methods', path: '/paymentMethod' },
  ];


    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">Order History</h1>

            <div className="three-column-layout">
                <div className="account-sidebar">
                    <h2 className="admin-box-heading">My Account</h2>
                    <ul className="sidebar-nav-list">
                        {sidebarLinks.map((link) => (
                            <li
                                key={link.name}
                                className={window.location.pathname === link.path ? 'active' : ''}
                                onClick={() => navigate(link.path)}
                            >
                                <a href={link.path} className="block" onClick={(e) => e.preventDefault()}>
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div> 

                <div className='threeColumns-account-container'>
                  <div className="account-header">
                    <h2 className="admin-box-heading">New Address</h2>
                  </div>

                  <div className='input'>
                      <label htmlFor="address">Address*</label>
                      <input id="address" type='text' placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </div>

                    <div className='input'>
                      <label htmlFor="postcode">Post Code*</label>
                      <input id="postcode" type='number' placeholder="Post Code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                    </div>

                    <div className='input'>
                      <label htmlFor="state">State*</label>
                      <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
                        <option value="">State</option>
                        <option>NSW</option>
                        <option>VIC</option>
                        {/* ... other state options */}
                      </select>
                    </div>

                    <div className='container-account'>
                    <div className="submit" onClick={handleRecoverClick}>Add Address</div>
                  </div>
                </div>

                <div className="threeColumns-account-container">
                    <div className='admin-box-heading'>Address Book</div>
                    <div className='underline'></div>
                    
                    <ul className="account-box-list">
                        <li>Shipping Address: 123 street, suburb</li>
                        <li>Secondary Shipping Address: 123 street, suburb</li>
                        <li>Billing Address: 123 street, suburb</li>
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default AddressBook;

