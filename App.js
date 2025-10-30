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
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Hardcoded backend auth URL
        const response = await axios.get("http://localhost:3001/me", { withCredentials: true });
        setIsLoggedIn(true);
        if (response.data && response.data.isAdmin === true) {
          setIsAdmin(true);
        }
      } catch (error) {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleAddToCart = (item) => {
    setCartItems(prevItems => [...prevItems, item]);
    alert(`${item.name} has been added to your cart!`);
    console.log("Current cart:", [...cartItems, item]);
  };

  const handleLogin = (isAdmin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);

    window.location.href = isAdmin ? '/adminAccount' : '/employeePage';
  };

  const handleLogout = async () => {
    try {
      // Hardcoded backend auth URL
      await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      alert("Logout Successful.");
      setIsLoggedIn(false);
      setIsAdmin(false);
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