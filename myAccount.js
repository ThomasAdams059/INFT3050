import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios'; 

const MyAccount = () => {

    const { user } = useSelector((state) => state.auth);

    
    const [latestAddress, setLatestAddress] = useState("Loading latest address...");
    const [fetchError, setFetchError] = useState(null);

    // navigation handlers
    const handleOrderHistoryClick = () => {
        window.location.href = '/orderHistory'; 
    };
    const handleAccountSettingsClick = () => {
        window.location.href = '/accountSettings'; 
    };
    
    
    useEffect(() => {

        // only run if the user is loaded  is a patron

        if (user && !user.hasOwnProperty('UserName')) {
            
            const fetchLatestOrderAddress = async () => {
                setFetchError(null);
                try {
                    // gets all orders
                    const response = await axios.get(
                        "http://localhost:3001/api/inft3050/Orders",
                        { withCredentials: true } 
                    );

                    const allOrders = response.data.list || [];
                    
                    // filters orders for current patron 
                    const patronOrders = allOrders.filter(order => 
                        order.TO && order.TO.PatronId === user.UserID
                    );

                    if (patronOrders.length > 0) {
                        // Sort by OrderDate to find recent
                        patronOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
                        
                        // gets latest one
                        const latestOrder = patronOrders[0];
                        
                        // formatting address string
                        if (latestOrder.StreetAddress) {
                            const addressString = `${latestOrder.StreetAddress}, ${latestOrder.Suburb || ''}, ${latestOrder.State || ''} ${latestOrder.PostCode || ''}`;
                            setLatestAddress(addressString);
                        } else {
                            setLatestAddress("No address found on your last order.");
                        }
                    } else {
                        // for patrons with no orders
                        setLatestAddress("No orders found. Add an address in Settings.");
                    }
                } catch (err) {
                    console.error("Error fetching orders:", err);
                    setFetchError("Could not load latest address.");
                    setLatestAddress("Error loading address."); // errors logs
                }
            };

            fetchLatestOrderAddress();
        }
    }, [user]); // runs when the user object is loaded from Redux


    // Helper function to render user details or loading state
    const renderAccountDetails = () => {
        if (!user) {
            return <p>Loading account details...</p>;
        }
        
        let userAddress; 

        // shows correct address with this new logic
        if (user.Address) {
            // employee or admins
            userAddress = `${user.Address}, ${user.Suburb || ''} ${user.State || ''} ${user.PostCode || ''}`;
        } else if (user.hasOwnProperty('UserName')) {
             // employee or admin address is blank
             userAddress = 'No address on file.';
        } else {
            //use state variables
            userAddress = fetchError ? <span style={{color: 'red'}}>{fetchError}</span> : latestAddress;
        }

        return (
            <ul className="account-box-list">
                <li>Full Name: {user.Name}</li>
                <li>Email Address: {user.Email}</li>
                <li>Address: {userAddress}</li>
            </ul>
        );
    };

    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">My Account</h1>

           
            <div className ="account-dashboard-layout" style={{ gridTemplateRows: '1fr' }}>

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
                    
                    {/* uses redux and new state */}
                    {renderAccountDetails()}

                    <button className="admin-manage-button" onClick={handleAccountSettingsClick}>
                        Manage Account Settings
                    </button>
                </div>  

                
                
            </div>
        </div>
    );
};

export default MyAccount;
