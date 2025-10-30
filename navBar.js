import React, { useState } from 'react';

// --- 1. ACCEPT 'isAdmin' and 'onLogout' PROPS ---
export default function Navbar({ isLoggedIn, userRole, onLogout, onSearch }) {
    
  // State to hold the current value of the search input
    const [searchTerm, setSearchTerm] = useState("");

    // Handle logout click
    const handleLogoutClick = (e) => {
      e.preventDefault(); 
      onLogout();
    };

    // Handle the search input field change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle the form submission
    const handleSearchSubmit = (e) => {
        e.preventDefault(); // Prevents the page from reloading
        
        // Pass the search term up to the parent component via the onSearch prop
        if (onSearch && searchTerm.trim() !== "") {
            onSearch(searchTerm.trim());
            setSearchTerm(""); // Clear the search bar after submitting
        }
    };

  // determines account page URL based on user role
  const getAccountHref = () => {
    if (!isLoggedIn) {
      return "/login";
    }
    
    switch (userRole) {
      case 'admin':
        return '/adminAccount';
      case 'employee':
        return '/employeePage';
      case 'patron':
        return '/accountSettings';
      default:
        return '/login';
    }
  };

  // gets appropriate account button text based on role
  const getAccountText = () => {
    if (!isLoggedIn) {
      return "Account";
    }
    
    switch (userRole) {
      case 'admin':
        return 'Admin';
      case 'employee':
        return 'Employee';
      case 'patron':
        return 'Account';
      default:
        return 'Account';
    }
  };

  const accountHref = getAccountHref();
  const accountText = getAccountText();

  // cart should only show for patrons
  const showCart = isLoggedIn && userRole === 'patron';
    return (
      <nav className="nav">
        <a href="/" className="site-title">The Entertainment Guild</a>
        <div className="search-container">
          <form onSubmit={handleSearchSubmit}> 
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input" 
              value={searchTerm}
              onChange={handleSearchChange} 
            />
            <button type="submit" className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        <ul className="nav-links-container">
          <div className="main-nav-links">
            <CustomLink href="/genre">Genre</CustomLink>
            <CustomLink href="/newReleases">New Releases</CustomLink>
            <CustomLink href="/bestSellers">Best Sellers</CustomLink>
            <CustomLink href="/author">Author</CustomLink>
          </div>

        <div className="user-nav-links">
          <CustomLink href="/Cart">
            <img
                src= '/cart.svg'
                alt="Cart"
                style={{width: "20px", height: "20px",marginRight: "6px"}} />
            Cart
          </CustomLink>

          {isLoggedIn ? (
             <CustomLink href={accountHref}>
               <img
                   src= '/account.svg'
                   alt="Account"
                   style={{width: "20px", height: "20px",marginRight: "6px"}} />
               Account
             </CustomLink>
          ) : (
            <CustomLink href={accountHref}>
              <img
                  src= '/account.svg'
                  alt="Account"
                  style={{width: "20px", height: "20px",marginRight: "6px"}} />
              Account
            </CustomLink>
          )}

          {isLoggedIn && (
            <li>
              <a href="/logout" onClick={handleLogoutClick} className="logout-link" style={{display: 'flex', alignItems: 'center'}}>
                <img
                    src= '/logout.svg'
                    alt="Logout"
                    style={{width: "20px", height: "20px",marginRight: "6px"}} />
                Logout
              </a>
            </li>
          )}
        </div>
      </ul>
    </nav>
  );
}

function CustomLink({ href, children, ...props}) {
  const path = window.location.pathname;
  return (
    <li className={path === href ? "active" : ""}>
      <a href={href} {...props}>
        {children}
      </a>
    </li>
  );
}
