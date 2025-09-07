import Navbar from "./navBar"
import HomePage from "./homepage"
import Genre from "./genre"
import NewReleases from "./newReleases"
import BestSellers from "./bestSellers"
import Author from "./author"
import ProductPage from "./products"
import Footer from "./footer"
import Login from "./login"
import RecoverAccount from "./recoverAccount"
import './styles.css';

function App() {
  
  let component
  switch (window.location.pathname) {
    case "/":
      component = <HomePage />
      break
    case "/genre":
      component = <Genre />
      break
    case "/newReleases":
      component = <NewReleases />
      break
    case "/bestSellers":
      component = <BestSellers />
      break
    case "/author":
      component = <Author />
      break
    case "/products":
      component = <ProductPage />
      break
    case "/login":
      component = <Login />
      break
    case "/recoverAccount":
      component = <RecoverAccount/>
      break
  
  }
  return ( 
    <>
      <Navbar />
      <div className="container">
      {component}
    </div>
    <Footer />
    </>
  );
}

export default App;
