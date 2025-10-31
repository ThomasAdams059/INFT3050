import React from 'react';

// Accept the currentUser prop from App.js
const MyAccount = ({ currentUser }) => {

    // Navigation handlers remain the same
    const handleOrderHistoryClick = () => {
        window.location.href = '/orderHistory'; 
    };
    const handleAccountSettingsClick = () => {
        window.location.href = '/accountSettings'; 
    };
    const handleAddressBookClick = () => {
        window.location.href = '/addressBook'; 
    };
    const handlePaymentMethodsClick = () => {
        window.location.href = '/paymentMethod'; 
    };

    // Helper function to render user details or loading state
    const renderAccountDetails = () => {
        if (!currentUser) {
            return <p>Loading account details...</p>;
        }
        
        // Admin/Employee users have an 'Address' field from the /me endpoint
        // Patrons (from /me) do not have an address field in this object
        let userAddress = 'No address on file.';

        if (currentUser.Address) {
            // This is for Admin/Employee users
            userAddress = `${currentUser.Address}, ${currentUser.Suburb || ''} ${currentUser.State || ''} ${currentUser.PostCode || ''}`;
        } else if (currentUser.hasOwnProperty('UserName')) {
             // It's an Employee/Admin but their address field is blank
             userAddress = 'No address on file.';
        } else {
            // This is for Patrons
            userAddress = 'Manage address in "Address Book".';
        }

        return (
            <ul className="account-box-list">
                <li>Full Name: {currentUser.Name}</li>
                <li>Email Address: {currentUser.Email}</li>
                <li>Address: {userAddress}</li>
            </ul>
        );
    };

    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">My Account</h1>

            <div className ="account-dashboard-layout">

                <div className="account-box">
                    <h2 className="admin-box-heading">Order History</h2>
                    
                    <ul className="account-box-list">
                        <li>View your recent orders</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handleOrderHistoryClick}>
                        See All Orders
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Account Settings</h2>
                    
                    {/* Render dynamic details */}
                    {renderAccountDetails()}

                    <button className="admin-manage-button" onClick={handleAccountSettingsClick}>
                        Manage Account Settings
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Address Book</h2>

                     <ul className="account-box-list">
                        <li>Manage your saved addresses</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handleAddressBookClick}>
                        Manage Address Book
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Payment Methods</h2>

                    <ul className="account-box-list">
                        <li>Manage your saved payment methods</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handlePaymentMethodsClick}>
                        Manage Payment Methods
                    </button>
                </div>  
            </div>
        </div>
    );
};

export default MyAccount;
