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

// --- Helper function to get cart from localStorage ---
const getCartFromStorage = () => {
  const cart = localStorage.getItem('entertainmentGuildCart');
  return cart ? JSON.parse(cart) : [];
};
// --- END NEW ---

function App() {
  // --- Initialize cart state from localStorage ---
  const [cartItems, setCartItems] = useState(getCartFromStorage());
  
  // --- All User/Auth State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPatron, setIsPatron] = useState(false);
  const [patronInfo, setPatronInfo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  // --- Effect for Cart Persistence (Saves cart to storage) ---
  useEffect(() => {
    localStorage.setItem('entertainmentGuildCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // --- Effect for Login Persistence (Checks login status on page load) ---
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await axios.get("http://localhost:3001/me", { withCredentials: true });
        
        setIsLoggedIn(true);
        setCurrentUser(response.data); // Store full user object

        // Correctly set all roles and info based on user data
        if (response.data && response.data.IsAdmin === true) {
          setIsAdmin(true);
          setIsPatron(false);
        } else if (response.data && response.data.hasOwnProperty('UserName')) {
          // It's an Employee (has UserName but not Admin)
          setIsAdmin(false);
          setIsPatron(false);
        } else if (response.data) {
          // It's a Patron
          setIsAdmin(false);
          setIsPatron(true);
          setPatronInfo({ customerId: response.data.UserID });
        }
      } catch (error) {
        // No valid session
        setIsLoggedIn(false);
        setIsAdmin(false);
        setIsPatron(false);
        setCurrentUser(null);
        setPatronInfo(null);
      }
    };

    checkLoginStatus();
  }, []); // Runs once on initial app load

  // --- This function is called by Cart.js AFTER a successful order ---
  const handleOrderSuccess = () => {
    console.log("App.js: Order successful, clearing cart.");
    setCartItems([]); // Clear state
    localStorage.removeItem('entertainmentGuildCart'); // Clear storage
  };

  // --- Cart Add Handler ---
  const handleAddToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.stockItemId === itemToAdd.stockItemId);

      if (existingItem) {
        return prevItems.map(item =>
          item.stockItemId === itemToAdd.stockItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...itemToAdd, quantity: 1 }];
      }
    });
  };

  // --- FIXED: handleLogin to correctly interpret user object and navigate ---
  const handleLogin = (isAdmin = false) => {
    setIsLoggedIn(true);
    setIsAdmin(isAdmin);

    window.location.href = isAdmin ? '/adminAccount' : '/employeePage';
  };

  // --- FIXED: handleLogout to clear all user state ---
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      alert("Logout Successful.");
      // Clear all auth state
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsPatron(false);
      setPatronInfo(null);
      setCurrentUser(null);
      // Clear cart
      setCartItems([]);
      localStorage.removeItem('entertainmentGuildCart');
      
      window.location.href = "/";
    }
  };

  // --- Search Handler ---
  const handleSearch = async (searchTerm) => {
    console.log("Search initiated for:", searchTerm);
    
    setLastSearchTerm(searchTerm); 

    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '');

    try {
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
            window.location.href = "/searchresults?query=" + encodeURIComponent(searchTerm); 
            return;
        }

        const matches = products.filter(product => {
            if (!product.Name && !product.Author) return false;
            
            const name = product.Name?.toLowerCase().replace(/\s/g, '');
            const author = product.Author?.toLowerCase().replace(/\s/g, '');
            
            return name.includes(normalizedSearchTerm) || author.includes(normalizedSearchTerm);
        });

        if (matches.length === 1) {
            const productId = matches[0].ID;
            const path = `/products?id=${productId}`;
            
            console.log("Single product found, navigating to:", path);
            window.location.href = path;
            
        } else {
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

  // --- UPDATED Router to pass all correct props ---

  if (path.startsWith("/products")) {
    component = <ProductPage 
                  onAddToCart={handleAddToCart}
                  isLoggedIn={isLoggedIn}
                  isPatron={isPatron}
                  patronInfo={patronInfo}
                />;
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
        component = <CreateAccount />; // Removed onCreateAccount prop
        break;
      case "/recoverAccount":
        component = <RecoverAccount />;
        break;
      case "/Cart":
        component = <CartPage 
                      cartItems={cartItems}
                      isLoggedIn={isLoggedIn}
                      isPatron={isPatron}
                      patronInfo={patronInfo}
                      isAdmin={isAdmin}
                      onOrderSuccess={handleOrderSuccess}
                      currentUser={currentUser} // Pass current user for address
                    />;
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
        component = <MyAccount currentUser={currentUser} />;
        break;
      case "/orderHistory":
        component = <OrderHistory currentUser={currentUser} />;
        break;
      case "/accountSettings":
        component = <AccountSettings currentUser={currentUser} />;
        break;
      case "/addressBook":
        component = <AddressBook currentUser={currentUser} />;
        break;
      case "/paymentMethod":
        component = <PaymentMethods currentUser={currentUser} />;
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
      default:
        component = <HomePage />;
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

