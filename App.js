import Navbar from "./navBar"
import HomePage from "./homepage"
import Genre from "./genre"
import newReleases from "./newReleases"
import bestSellers from "./bestSellers"
import Author from "./author"
import ProductPage from "./products"
import './styles.css';

//The main component
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
      component = <newReleases />
      break
    case "/bestSellers":
      component = <bestSellers />
      break
    case "/author":
      component = <Author />
      break
    case "/products":
      component = <ProductPage />
      break
  }
  return ( 
    <>
      <Navbar />
      <div className="container">
      {component}
    </div>
    </>
  );
}

export default App;
