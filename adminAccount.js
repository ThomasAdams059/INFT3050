import React from 'react';

const AdminAccount = () => {
  // Functions to handle button clicks (navigate to management pages)
  const handleManageUsersClick = () => {
    window.location.href = '/userManagement';
  };

  const handleManageItemsClick = () => {
    window.location.href = '/itemManagement';
  };

  const handleMyAccountClick = () => {
    window.location.href = '/myAccount';
  };

  const handleManagePatronsClick = () => {
    window.location.href = '/patronManagement';
  };

  return (
    <div className="main-container">
      <h1 className="main-heading custom-header-color">Admin Mode</h1>
      
      <div className="admin-dashboard-layout">
        
        {/* User Management Box */}
        <div className="admin-box">
          <h2 className="admin-box-heading">User Management</h2>
          <ul className="admin-task-list">
            <li>Add User</li>
            <li>Edit User</li>
            <li>Delete User</li>
          </ul>
          <button className="admin-manage-button" onClick={handleManageUsersClick}>
            Manage Users
          </button>
        </div>
        
        {/* Item Management Box */}
        <div className="admin-box">
          <h2 className="admin-box-heading">Item Management</h2>
          <ul className="admin-task-list">
            <li>Add New Item</li>
            <li>Edit Existing Item</li>
            <li>Delete Existing Item</li>
          </ul>
          <button className="admin-manage-button" onClick={handleManageItemsClick}>
            Manage Items
          </button>
        </div>

        <div className="admin-box">
          <h2 className="admin-box-heading">Patron Management</h2>
          <ul className="admin-task-list">
            <li>Edit Existing Patron</li>
            <li>Delete Existing Patron</li>
            <li>-</li>
          </ul>
          <button className="admin-manage-button" onClick={handleManagePatronsClick}>
            Manage Patrons
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default AdminAccount;