export default function Navbar() {
    const path = window.location.pathname;
    return (
      <nav className="nav">
        <a href="/" className="site-title">The Entertainment Guild</a>
        <div className="search-container">
          <input type="text" placeholder="Search..." className="search-input" />
          <button className="search-button">
            {/* Using an inline SVG for the search icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>

        </div>
        <ul>
      {/* for account icon */}
          <CustomLink href="/login">
          <img 
              src= '/account.svg'
              alt="Account"
              style={{width: "20px", height: "20px",marginRight: "6px"}} />
          Account
          </CustomLink>
          
      {/* for cart icon */}
           <CustomLink href="/Cart">
          <img 
              src= '/cart.svg'
              alt="Cart"
              style={{width: "20px", height: "20px",marginRight: "6px"}} />
          Cart
          </CustomLink>
        
          <CustomLink href="/genre">Genre</CustomLink>
          <CustomLink href="/newReleases">New Releases</CustomLink>
          <CustomLink href="/bestSellers">Best Sellers</CustomLink>
          <CustomLink href="/author">Author</CustomLink>
          <CustomLink href="/products">Products</CustomLink>
          
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
  
