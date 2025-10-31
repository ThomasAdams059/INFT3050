import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Accept currentUser prop from App.js
const AddressBook = ({ currentUser }) => {
    // --- NEW: Handle nested user object ---
    // This checks if App.js passed the whole response { user: {...} }
    // or just the user object itself.
    const user = currentUser ? (currentUser.user || currentUser) : null;

    // State for the "Add Address" form
    const [streetAddress, setStreetAddress] = useState("");
    const [suburb, setSuburb] = useState("");
    const [postcode, setPostcode] = useState("");
    const [state, setState] = useState("NSW"); // Default to NSW
    const [country, setCountry] = useState("Australia"); // Default to Australia

    // State for managing the list of addresses
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Helper function to fetch the user's addresses
    const fetchAddresses = async () => {
        if (!user || user.hasOwnProperty('UserName')) {
            // This page is for Patrons. Admins/Employees manage their single address
            // in AccountSettings.
            return;
        }

        setIsLoading(true);
        try {
            // Patrons' addresses are stored on the Patron object
            const response = await axios.get(
                `http://localhost:3001/api/inft3050/Patrons/${user.UserID}`,
                { withCredentials: true }
            );
            setAddresses(response.data['Address List'] || []);
        } catch (error) {
            console.error("Error fetching addresses:", error.response || error);
            setErrorMessage("Could not load your addresses.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch addresses on component mount (when 'user' is available)
    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    // --- Handle adding a new address ---
    const handleAddAddress = async (event) => {
        event.preventDefault();
        
        if (!streetAddress || !suburb || !postcode || !state || !country) {
            setErrorMessage("Please fill in all address fields.");
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const payload = {
                PatronId: user.UserID,
                StreetAddress: streetAddress,
                Suburb: suburb,
                PostCode: postcode,
                State: state,
                Country: country
            };
            
            await axios.post(
                "http://localhost:3001/api/inft3050/Address",
                payload,
                { withCredentials: true }
            );
            
            setSuccessMessage("Address added successfully!");
            // Clear the form
            setStreetAddress("");
            setSuburb("");
            setPostcode("");
            // Re-fetch addresses to show the new one
            await fetchAddresses();

        } catch (error) {
            console.error("Error adding address:", error.response || error);
            setErrorMessage(error.response?.data?.message || "Failed to add address.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- Handle deleting an address ---
    const handleDeleteAddress = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) {
            return;
        }

        setIsLoading(true);
        setErrorMessage("");
        setSuccessMessage("");
        
        try {
            await axios.delete(
                `http://localhost:3001/api/inft3050/Address/${addressId}`,
                { withCredentials: true }
            );
            setSuccessMessage("Address deleted successfully!");
            // Re-fetch addresses to remove it from the list
            await fetchAddresses();

        } catch (error) {
            console.error("Error deleting address:", error.response || error);
            setErrorMessage(error.response?.data?.message || "Failed to delete address.");
        } finally {
            setIsLoading(false);
        }
    };


    // --- Sidebar and Navigation Logic (Unchanged) ---
    const navigate = (path) => {
        window.location.href = path;
    };

    const sidebarLinks = [
        { name: 'Account Dashboard', path: '/myAccount' },
        { name: 'Order History', path: '/orderHistory' },
        { name: 'Account Settings', path: '/accountSettings' },
        { name: 'Address Book', path: '/addressBook' },
        { name: 'Payment Methods', path: '/paymentMethod' },
    ];
    // --- End Sidebar Logic ---

    // Show loading or non-patron message
    if (!user) {
        return (
            <div className="main-container">
                <h1 className="main-heading custom-header-color">Address Book</h1>
                <p>Loading user data...</p>
            </div>
        );
    }

    if (user.hasOwnProperty('UserName')) {
        return (
            <div className="main-container">
                <h1 className="main-heading custom-header-color">Address Book</h1>
                <p>Your address is managed in the "Account Settings" page.</p>
            </div>
        );
    }

    return (
        <div className="main-container">
            {/* --- UPDATED Title --- */}
            <h1 className="main-heading custom-header-color">Address Book</h1>

            <div className="three-column-layout">
                {/* --- Sidebar --- */}
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

                {/* --- Add Address Form --- */}
                <div className='threeColumns-account-container'>
                    {/* --- UPDATED: Form now works --- */}
                    <form onSubmit={handleAddAddress}>
                        <div className="account-header">
                            <h2 className="admin-box-heading">Add New Address</h2>
                        </div>

                        <div className="inputs">
                            <div className='input'>
                                <label htmlFor="address">Street Address*</label>
                                <input id="address" type='text' placeholder="123 Example St" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} />
                            </div>
                            
                            <div className='input'>
                                <label htmlFor="suburb">Suburb*</label>
                                <input id="suburb" type='text' placeholder="Suburb" value={suburb} onChange={(e) => setSuburb(e.target.value)} />
                            </div>

                            <div className='input'>
                                <label htmlFor="postcode">Post Code*</label>
                                <input id="postcode" type='text' placeholder="Post Code" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                            </div>

                            <div className='input'>
                                <label htmlFor="state">State*</label>
                                <select id="state" value={state} onChange={(e) => setState(e.target.value)}>
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

                            <div className='input'>
                                <label htmlFor="country">Country*</label>
                                <input id="country" type='text' placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
                            </div>
                        </div>

                        <div className='container-account'>
                            <button type="submit" className="submit" disabled={isLoading}>
                                {isLoading ? "Adding..." : "Add Address"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- Saved Address List --- */}
                <div className="threeColumns-account-container">
                    <div className='admin-box-heading'>Saved Addresses</div>
                    <div className='underline'></div>
                    
                    {/* --- UPDATED: List is now dynamic --- */}
                    {isLoading && <p>Loading addresses...</p>}
                    
                    {addresses.length > 0 ? (
                        <ul className="account-box-list">
                            {addresses.map(addr => (
                                <li key={addr.AddressID} style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                                    <span>
                                        {addr.StreetAddress}, {addr.Suburb}, {addr.State} {addr.PostCode}, {addr.Country}
                                    </span>
                                    <button 
                                        onClick={() => handleDeleteAddress(addr.AddressID)}
                                        style={{ float: 'right', background: 'red', color: 'white', border: 'none', cursor: 'pointer' }}
                                        disabled={isLoading}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        !isLoading && <p>You have no saved addresses.</p>
                    )}
                </div>
            </div>

            {/* --- Global Messages for the page --- */}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {errorMessage && <p className="error-message" style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p className="success-message" style={{ color: 'green' }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default AddressBook;
