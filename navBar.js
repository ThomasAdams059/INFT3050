import React from 'react';

export default function Navbar({ isLoggedIn, isAdmin, onLogout }) {

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
  };

  const accountHref = isLoggedIn
    ? (isAdmin ? "/myAccount" : "/adminAccount")
    : "/login";

  return (
    <nav className="nav">
      <a href="/" className="site-title">The Entertainment Guild</a>
      <div className="search-container">
        <input type="text" placeholder="Search..." className="search-input" />
        <button className="search-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
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
