import React from 'react';

const MyAccount = () => {

    // Function to handle button click (navigate to appropriate page)
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

    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">My Account</h1>

            <div className ="account-dashboard-layout">

                <div className="account-box">
                    <h2 className="admin-box-heading">Order History</h2>
                    
                    <ul className="account-box-list">
                        <li>Recent Order(s)</li>
                        <li>Recent Orders will show up here</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handleOrderHistoryClick}>
                        See All Orders
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Account Settings</h2>

                    <ul className="account-box-list">
                        <li>Full Name: John Smith</li>
                        <li>Email Address: johnsmith@gmail.com</li>
                        <li>Address: 123 street, suburb</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handleAccountSettingsClick}>
                        Manage Account Settings
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Address Book</h2>

                     <ul className="account-box-list">
                        <li>Added Addresses will show up here</li>
                    </ul>

                    <button className="admin-manage-button" onClick={handleAddressBookClick}>
                        Manage Address Book
                    </button>
                </div>  

                <div className="account-box">
                    <h2 className="admin-box-heading">Payment Methods</h2>

                    <ul className="account-box-list">
                        <li>Added payment methods will show up here</li>
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