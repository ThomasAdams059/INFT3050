import React from 'react';

const OrderedItems = () => {
  return (
    <div className="order-item">
      <div className="orderHistory-item-details">
        <div className="order-item-info">
          <p className="order-item-name">Order Number: 0000000</p>
          <p className="order-item-price">$##.##</p>
        </div>
      </div>
    </div>
  );
};

// Helper function for navigation
const navigate = (path) => {
    window.location.href = path;
};

const OrderHistory = () => {

    /* Handle for button - currently just a placeholder for the button to work */
    const handleAddressBookClick = () => {
        window.location.href = '/addressBook'; 
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

                <div className="orderHistory-box">
                        <h2 className="admin-box-heading">Order History</h2>
                        
                        <div className="cart-items-container">
                            <OrderedItems />
                            <OrderedItems />
                            <OrderedItems />    
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

                    <button className="threeColumns-account-container-button" onClick={handleAddressBookClick}>
                        Add New Address
                    </button>
                </div>
            </div>

            


        </div>
    );
};

export default OrderHistory;
