import React, { useState } from 'react';

const PaymentMethods = () => {

    const [name, setName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvc, setCvc] = useState("");
    const [isPrimary, setIsPrimary] = useState(false);

     /* Handle for button - currently just a placeholder for the button to work */
    const handleRecoverClick = () => {
        window.location.href = "/recoverAccount";
    };

// Helper function for navigation
const navigate = (path) => {
    window.location.href = path;
};

const SavedCard = ({ name, lastFour, cvc, expiry, type }) => (
    <div className="cardDetails">
        
        {/* LEFT BLOCK: Icon and Name */}
        <div className="card-icon-container-display">
            {/* Using a placeholder for the card logo */}
            <div className="card-logo-placeholder">
                {type.slice(0, 4).toUpperCase()} 
            </div>
            <span className="card-name">{name}</span>
        </div>

        {/* RIGHT BLOCK: Details */}
        <div className="card-info-block">
            <p className="card-number-text">Card Number: **** **** **** {lastFour}</p>
            <div className="card-meta-row">
                <span>CVC: {cvc}</span>
                <span>Expiry: {expiry}</span>
            </div>
        </div>
    </div>
);

// Links for the sidebar
    const sidebarLinks = [
        { name: 'Account Dashboard', path: '/myAccount' },
        { name: 'Order History', path: '/orderHistory' },
        { name: 'Account Settings', path: '/accountSettings' },
        { name: 'Address Book', path: '/addressBook' },
        { name: 'Payment Methods', path: '/paymentMethod' },
    ];

const savedCards = [
    { name: 'Card 1', lastFour: '1111', cvc: '333', expiry: '08/28', type: 'MasterCard' },
    { name: 'Card 2', lastFour: '2222', cvc: '999', expiry: '12/26', type: 'VISA' },
];

    return (
        <div className="main-container">
            <h1 className="main-heading custom-header-color">Payment Methods</h1>

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
                        <h2 className="admin-box-heading">Add a New Card</h2>
                    </div>

                    <div className="inputs">
                        <div className='input'>
                            <label htmlFor="name">Card Information</label>
                            <input id="name" type='text' placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className='input'>
                            <input id="cardNum" type='number' placeholder="cardNum" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                        </div>

                        <div className='input'>
                            <input id="expiry" type='date' placeholder="expiry" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                        </div>

                        <div className='input'>
                            <input id="cvc" type='number' placeholder="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                        </div>

                        <div className='input-checkbox-row'>
                            <input id="isPrimary" type="checkbox" checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)}/>
                            <label htmlFor="isPrimary">Primary Card</label>
                        </div>

                        <div className='container-account'>
                            <div className="threeColumns-account-container-button" onClick={handleRecoverClick}>Add New Card</div>
                        </div>
                    </div>
                </div>

                <div className='threeColumns-account-container'>
                    <h2 className="admin-box-heading">Saved Payment Methods</h2>
                    
                    {/* Loop through your cards */}
                    {savedCards.map((card, index) => (
                        <SavedCard 
                            key={index} 
                            name={card.name} 
                            lastFour={card.lastFour} 
                            cvc={card.cvc} 
                            expiry={card.expiry} 
                            type={card.type} 
                        />
                    ))}
                    
                    {/* Optional: Button or link to manage cards */}
                    <div className="threeColumns-account-container-button">Manage Payment Methods</div>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethods;

