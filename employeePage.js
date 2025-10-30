// src/employeePage.js
import React from 'react';

const EmployeePage = () => {
  // Navigation handlers
  const handleViewAccountsClick = () => {
    window.location.href = '/viewAccounts';
  };

  const handleViewOrdersClick = () => {
    window.location.href = '/viewOrders';
  };

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Employee Dashboard</h1>

      {/* Use layout similar to admin dashboard if desired */}
      <div className="admin-dashboard-layout"> {/* Re-using class for layout consistency */}

        {/* View Accounts Box */}
        <div className="admin-box"> {/* Re-using class */}
          <h2 className="admin-box-heading">View Accounts</h2>
          <ul className="admin-task-list"> {/* Re-using class */}
            <li>View All Admin Users</li>
            <li>View All Patron Accounts</li>
          </ul>
          <button className="admin-manage-button" onClick={handleViewAccountsClick}> {/* Re-using class */}
            View Accounts
          </button>
        </div>

        {/* View Orders Box */}
        <div className="admin-box"> {/* Re-using class */}
          <h2 className="admin-box-heading">View Orders</h2>
          <ul className="admin-task-list"> {/* Re-using class */}
            <li>View All Customer Orders</li>
            <li>Check Order Details</li>
          </ul>
          <button className="admin-manage-button" onClick={handleViewOrdersClick}> {/* Re-using class */}
            View Orders
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeePage;