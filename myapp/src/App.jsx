// importing the necessary modules 
import Login from "./Pages/Login/Login";
import { Component, Fragment } from 'react';
import { AuthContext } from './Auth/AuthContext';
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Services from "./Pages/Services/Services";
import AboutPage from "./Pages/About/About";
import Home from "./Pages/Home/Home";
import AnalyzedHistoryData from './Pages/AnalyzedData/AnalyzedData';
import TrainNeuralNetwork from './Pages/TrainNeuralNetwork/TrainNetwork';
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Setting the token variable 
let tokenValue = localStorage.getItem("xAuthToken") || null; 

// rendering the app component 
class App extends Component {
  // Getting the auth context 
  static contextType = AuthContext;

  // Setting the state 
  state = {
    loading: true
  }

  // Lifecycle method equivalent to useEffect with an empty dependency array []
  componentDidMount() {
    // Getting the context daa from this.context 
    const { setToken } = this.context; 

    // Set the token value only once when the component mounts 
    if (tokenValue !== null) {
        // Set the token 
        setToken(tokenValue); 
    }

    // setting the timer 
    this.timer = setTimeout(() => {
      this.setState({ loading: false });
    }, 1000); 
  }

  // Lifecycle method equivalent to the cleanup function in useEffect
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // render method to return the JSX
  render() {
    // Getting the context data 
    const { isLoggedIn, xAuthToken } = this.context; 

    // If the token value, and islogged in condition 
    // is presetn, redirect the user to the dashboard page
    if (isLoggedIn && xAuthToken) {
      // return the route
      return(
        <Fragment> 
          <BrowserRouter> 
          {/* Setting the routes configurations */}
          <Routes> 
              <Route path="/" element={<Dashboard />} />
              <Route path="/login" element={<Dashboard /> } />
              <Route path="/register" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard /> } />
              <Route path="/history" element={<AnalyzedHistoryData /> } /> 
              <Route path="/trainNeuralNetwork" element={<TrainNeuralNetwork /> } />
              <Route path="/services" element={<Services /> } /> 
              <Route path="/about" element={<AboutPage />} /> 
              <Route path="*" exact={true} element={<Dashboard /> } />
          </Routes>
          </BrowserRouter>
        </Fragment>
      ); 
    }

    // if the conditions are false execute the block of code 
    // below 
    else {
      // Return the default non-login page 
      return(
        <Fragment> 
          <BrowserRouter> 
              {/* Setting the routes configuration */}
              <Routes> 
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Home />} />
                <Route path="/login" element={<Login /> } /> 
                <Route path="/register" element={<Register />} />
                 <Route path="/services" element={<Services /> } />
                  <Route path="/about" element={<AboutPage />} /> 
                <Route path="*" exact={true} element={<Home />} />
              </Routes>
          </BrowserRouter>
        </Fragment>
      )
    } 
  }
}

// exporting the app component 
export default App;