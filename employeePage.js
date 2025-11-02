// src/employeePage.js
import React from 'react';

const EmployeePage = () => {
  // navigation logics
  const handleViewAccountsClick = () => {
    window.location.href = '/viewAccounts';
  };

  const handleViewOrdersClick = () => {
    window.location.href = '/viewOrders';
  };

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Employee Dashboard</h1>

      {/* same alyout as admin dashboard */}
      <div className="admin-dashboard-layout">

        {/* View Accounts Box */}
        <div className="admin-box"> 
          <h2 className="admin-box-heading">View Accounts</h2>
          <ul className="admin-task-list"> 
            <li>View All Admin Users</li>
            <li>View All Patron Accounts</li>
          </ul>
          <button className="admin-manage-button" onClick={handleViewAccountsClick}> 
            View Accounts
          </button>
        </div>

        {/* view orders box */}
        <div className="admin-box">
          <h2 className="admin-box-heading">View Orders</h2>
          <ul className="admin-task-list">
            <li>View All Customer Orders</li>
            <li>Check Order Details</li>
          </ul>
          <button className="admin-manage-button" onClick={handleViewOrdersClick}> 
            View Orders
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmployeePage;