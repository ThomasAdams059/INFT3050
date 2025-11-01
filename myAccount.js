import React, { useState, useEffect } from 'react'; // --- 1. IMPORT useState, useEffect ---
import { useSelector } from 'react-redux';
import axios from 'axios'; // --- 2. IMPORT axios ---

const MyAccount = () => {

    const { user } = useSelector((state) => state.auth);

    // --- 3. ADD State for the fetched address ---
    const [latestAddress, setLatestAddress] = useState("Loading latest address...");
    const [fetchError, setFetchError] = useState(null);

    // Navigation handlers
    const handleOrderHistoryClick = () => {
        window.location.href = '/orderHistory'; 
    };
    const handleAccountSettingsClick = () => {
        window.location.href = '/accountSettings'; 
    };
    
    // --- 4. ADD useEffect to fetch latest order address for Patrons ---
    useEffect(() => {
        // Only run this fetch if the user is loaded AND is a Patron
        // (Admins/Employees use the 'user.Address' field directly)
        if (user && !user.hasOwnProperty('UserName')) {
            
            const fetchLatestOrderAddress = async () => {
                setFetchError(null);
                try {
                    // Fetch all orders
                    const response = await axios.get(
                        "http://localhost:3001/api/inft3050/Orders",
                        { withCredentials: true } 
                    );

                    const allOrders = response.data.list || [];
                    
                    // Filter orders for the current patron
                    const patronOrders = allOrders.filter(order => 
                        order.TO && order.TO.PatronId === user.UserID
                    );

                    if (patronOrders.length > 0) {
                        // Sort by OrderDate (descending) to find the most recent
                        patronOrders.sort((a, b) => new Date(b.OrderDate) - new Date(a.OrderDate));
                        
                        // Get the latest one
                        const latestOrder = patronOrders[0];
                        
                        // Format the address string
                        if (latestOrder.StreetAddress) {
                            const addressString = `${latestOrder.StreetAddress}, ${latestOrder.Suburb || ''}, ${latestOrder.State || ''} ${latestOrder.PostCode || ''}`;
                            setLatestAddress(addressString);
                        } else {
                            setLatestAddress("No address found on your last order.");
                        }
                    } else {
                        // This patron has no orders yet
                        setLatestAddress("No orders found. Add an address in Settings.");
                    }
                } catch (err) {
                    console.error("Error fetching orders:", err);
                    setFetchError("Could not load latest address.");
                    setLatestAddress("Error loading address."); // Show error
                }
            };

            fetchLatestOrderAddress();
        }
    }, [user]); // This effect runs when the user object is loaded from Redux


    // Helper function to render user details or loading state
    const renderAccountDetails = () => {
        if (!user) {
            return <p>Loading account details...</p>;
        }
        
        let userAddress; // This will be set by the logic below

        // --- 5. UPDATE This logic to show the correct address ---
        if (user.Address) {
            // This is for Admin/Employee users
            userAddress = `${user.Address}, ${user.Suburb || ''} ${user.State || ''} ${user.PostCode || ''}`;
        } else if (user.hasOwnProperty('UserName')) {
             // It's an Employee/Admin but their address field is blank
             userAddress = 'No address on file.';
        } else {
            // This is for Patrons
            // We now use the state variable set by our useEffect
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

            {/* --- Grid layout (already updated) --- */}
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
                    
                    {/* This function now uses Redux and the new state */}
                    {renderAccountDetails()}

                    <button className="admin-manage-button" onClick={handleAccountSettingsClick}>
                        Manage Account Settings
                    </button>
                </div>  

                {/* --- Redundant boxes are already removed --- */}
                
            </div>
        </div>
    );
};

export default MyAccount;

