import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { logoutUser, checkLoginStatus } from './redux/authSlice'; 
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
import OrderCreate from './orderCreate';

const API_BASE_URL = "http://localhost:3001/api/inft3050";

function App() {
  
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cartItems');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      console.error("Could not parse cart items from localStorage", error);
      return [];
    }
  });
  
  const [lastSearchTerm, setLastSearchTerm] = useState("");

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkLoginStatus());
  }, [dispatch]);
  
  
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);


  // handles adding to cart

  const handleAddToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => item.stockItemId === itemToAdd.stockItemId
      );

      let newItems;
      if (existingItem) {
        newItems = prevItems.map(item =>
          item.stockItemId === itemToAdd.stockItemId
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        newItems = [...prevItems, itemToAdd];
      }
      
      console.log("Cart updated:", newItems);
      return newItems;
    });

    alert(`${itemToAdd.name} has been added to your cart!`);
  };

  // to remove a single product or item
  const handleRemoveItemFromCart = (stockItemIdToRemove) => {
    setCartItems(prevItems => 
      prevItems.filter(item => item.stockItemId !== stockItemIdToRemove)
    );
  };
  
  // clear cart function
  const handleClearCart = () => {
    setCartItems([]);
   
  };

  // makes sure logging out clears cart
  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        handleClearCart();
        alert("Logout Successful.");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Failed to logout:", error);
        handleClearCart(); 
        window.location.href = "/";
      });
  };

  // handles the search function with proper filters and accounts for user erros somewhat
  const handleSearch = async (searchTerm) => {
    console.log("Search initiated for:", searchTerm);
    setLastSearchTerm(searchTerm);
    const normalizedSearchTerm = searchTerm.toLowerCase().replace(/\s/g, '');
    try {
        const response = await axios.get(`${API_BASE_URL}/Product`, {
          headers: { 'Accept': 'application/json' },
        });
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


  // routing logic
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
        component = <Login />;
        break;
      case "/createAccount":
        component = <CreateAccount />;
        break;
      case "/recoverAccount":
        component = <RecoverAccount />;
        break;
      case "/Cart":
        // passes new props to cart page
        component = <CartPage 
          cartItems={cartItems} 
          onOrderSuccess={handleClearCart} 
          onRemoveItem={handleRemoveItemFromCart}
          onClearCart={handleClearCart}
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
      case "/createOrder":
        component = <OrderCreate 
          cartItems={cartItems} 
          onOrderSuccess={handleClearCart} 
        />;
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