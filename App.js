import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./navBar"
import HomePage from "./homepage"
import Genre from "./genre"
import NewReleases from "./newReleases"
import BestSellers from "./bestSellers"
import Author from "./author"
import ProductPage from "./products"
import Footer from "./footer"
import Login from "./login"
import CreateAccount from "./createAccount"
import RecoverAccount from "./recoverAccount"
import CartPage from "./Cart";
import AdminAccount from "./adminAccount";
import AccountSettings from "./accountSettings";
import UserManagement from "./userManagement";
import ItemManagement from "./itemManagement";
import PatronManagement from './patronManagement';
import MyAccount from "./myAccount";
import OrderHistory from "./orderHistory";
import './styles.css';
import AddressBook from './addressBook';
import PaymentMethods from './paymentMethod';
import EmployeePage from './employeePage';
import ViewAccounts from './viewAccounts';
import ViewOrders from './viewOrders';
import SearchResults from './searchResults';

const API_BASE_URL = "http://localhost:3001/api/inft3050";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPatron, setIsPatron] = useState(false);
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {

      const storedUserType = localStorage.getItem('userType');
      if (storedUserType) {
      // stored user type set state accordingly
      console.log("=== RESTORED FROM LOCALSTORAGE ===");
      console.log("User type:", storedUserType);

      setIsLoggedIn(true);

      if (storedUserType === 'patron') {
        setIsPatron(true);
        setIsAdmin(false);
      } else if (storedUserType === 'admin') {
        setIsAdmin(true);
        setIsPatron(false);
      } else if (storedUserType === 'employee') {
        setIsAdmin(false);
        setIsPatron(false);
      }

      try {
        // optional hardcoded backend auth URL
        await axios.get("http://localhost:3001/me", { withCredentials: true });
        console.log("Session verified with backend");

        // error log
        console.log("=== CHECK LOGIN STATUS ===");
        //console.log("Response from /me:", response.data);

        } catch (error) {
        // If patron, we expect this to fail since they don't have backend sessions
        if (storedUserType !== 'patron') {
          console.log("Backend session expired, clearing localStorage");
          localStorage.removeItem('userType');
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsPatron(false);
        }
      }
      } else {
      // no stored usedr type so try to check with backend
      try {
        const response = await axios.get("http://localhost:3001/me", { withCredentials: true });
        console.log("=== CHECK LOGIN STATUS FROM BACKEND ===");
        console.log("Response from /me:", response.data);
        // only works for user types not patrons
        setIsLoggedIn(true);
        setIsAdmin(false);
        setIsPatron(false);

        // /me does not return isAdmin so treat employee as default
        // this is only a fallback and is kept in because this is what we used before and incase localStorage does not work 
        localStorage.setItem('userType', 'employee');
       // checks if patron has @ in username logic
     } catch (error) {
        console.log("=== CHECK LOGIN STATUS ERROR ===");
        console.log(error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsPatron(false);
      }
    }
  };

  checkLoginStatus();
}, []);


  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
    console.log("Current cart:", [...cartItems, item]);
  };

  const handleLogin = (isAdmin = false, isPatron = false) => {
  setIsLoggedIn(true);
  setIsAdmin(isAdmin);
  setIsPatron(isPatron);

  // user type in localStorage for login persistence
  if (isPatron) {
    localStorage.setItem('userType', 'patron');
    console.log("Stored user type: patron");
    window.location.href = '/myAccount';
  } else if (isAdmin) {
    localStorage.setItem('userType', 'admin');
    console.log("Stored user type: admin");
    window.location.href = '/adminAccount';
  } else {
    localStorage.setItem('userType', 'employee');
    console.log("Stored user type: employee");
    window.location.href = '/employeePage';
  }
};
    //window.location.href = isAdmin ? '/adminAccount' : '/employeePage';
  

  const handleLogout = async () => {
  try {
    // try to log out, only works for user types and not patrons
    await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
  } catch (error) {
    console.error("Error during logout:", error);
    // continue with logout even if backend fails which it will probably
  } finally {
    alert("Logout Successful.");
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsPatron(false);
    localStorage.removeItem('userType'); // clears the stored user type
    console.log("Cleared user type from localStorage"); // to check
    window.location.href = "/";
  }
};

  const handleSearch = async (searchTerm) => {
    console.log("Search initiated for:", searchTerm);
    
    // Store the last search term for simple redirection, although SearchResults uses URL query
    setLastSearchTerm(searchTerm); 

    // 1. Convert search term to lowercase for filtering
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '');

    try {
        // 2. Fetch all products from the /Product endpoint
        const response = await axios.get(`${API_BASE_URL}/Product`,
        {
          headers: {
            'Accept': 'application/json'
          },
        }
      )
        
        const products = response.data.list;

        if (!products || products.length === 0) {
            alert(`Search failed: No products found on the server.`);
            // Navigate with query parameter for consistency
            window.location.href = "/searchresults?query=" + encodeURIComponent(searchTerm); 
            return;
        }

        // 3. Filter for matches (partial or exact) on Name or Author
        const matches = products.filter(product => {
            if (!product.Name && !product.Author) return false;
            
            const name = product.Name?.toLowerCase().replace(/\s/g, '');
            const author = product.Author?.toLowerCase().replace(/\s/g, '');
            
            // Check for partial match anywhere in Name or Author
            return name.includes(normalizedSearchTerm) || author.includes(normalizedSearchTerm);
        });

        // 4. Handle the result and navigate
        if (matches.length === 1) {
            // Only one result found: go straight to the product page
            const productId = matches[0].ID;
            const path = `/products?id=${productId}`;
            
            console.log("Single product found, navigating to:", path);
            window.location.href = path;
            
        } else {
            // Multiple or Zero results found: navigate to the search results page, passing the query in the URL
            console.log(`${matches.length} products found, navigating to search results.`);
            window.location.href = "/searchresults?query=" + encodeURIComponent(searchTerm);
        }

    } catch (error) {
        console.error("Error during product search:", error.response || error);
        alert(`Search failed: Unable to connect to product API or unauthorized. Check server status/login.`);
    }
  };

  let component;
  const path = window.location.pathname;

  if (path.startsWith("/products")) {
    component = <ProductPage onAddToCart={handleAddToCart} />;
  } else {
    switch (path) {
      case "/":
        component = <HomePage />;
        break;
      case "/genre":
        component = <Genre />;
        break;
      case "/newReleases":
        component = <NewReleases />;
        break;
      case "/bestSellers":
        component = <BestSellers />;
        break;
      case "/author":
        component = <Author />;
        break;
      case "/login":
        component = <Login onLogin={handleLogin} />;
        break;
      case "/createAccount":
        component = <CreateAccount onCreateAccount={handleLogin} />;
        break;
      case "/recoverAccount":
        component = <RecoverAccount />;
        break;
      case "/Cart":
        component = <CartPage cartItems={cartItems} />;
        break;
      case "/adminAccount":
        component = <AdminAccount />;
        break;
      case "/userManagement":
        component = <UserManagement />;
        break;
      case "/itemManagement":
        component = <ItemManagement />;
        break;
      case "/patronManagement":
        component = <PatronManagement />;
        break;
      case "/myAccount":
        component = <MyAccount />;
        break;
      case "/orderHistory":
        component = <OrderHistory />;
        break;
      case "/accountSettings":
        component = <AccountSettings />;
        break;
      case "/addressBook":
        component = <AddressBook />;
        break;
      case "/paymentMethod":
        component = <PaymentMethods />;
        break;
      default:
        component = <HomePage />;
        break;
      case "/employeePage":
        component = <EmployeePage />;
        break;
      case "/viewAccounts":
        component = <ViewAccounts />;
        break;
      case "/viewOrders":
        component = <ViewOrders />;
        break;
      case "/searchresults":
            component = <SearchResults />;
            break;
    }
  }
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isPatron={isPatron} // new passing to navbar
        onLogout={handleLogout}
        onSearch={handleSearch}
      />
      <div className="container">
        {component}
      </div>
      <Footer />
    </>
  );
}

export default App;