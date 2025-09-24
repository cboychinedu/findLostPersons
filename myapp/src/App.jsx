// importing the necessary modules 
import { Component } from 'react';
import Home from "./Pages/Home/Home";
import { AuthContext } from './Auth/AuthContext';
import Register from "./Pages/Register/Register";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AnalyzedHistoryData from './Pages/AnalyzedData/AnalyzedData';
import TrainNeuralNetwork from './Pages/TrainNeuralNetwork/TrainNetwork';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Fragment } from 'react';

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
    const { isLoggedIn, xAuthToken, setToken } = this.context; 

    // Setting the token value
    setToken(tokenValue);

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
              <Route path="/register" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard /> } />
              <Route path="/history" element={<AnalyzedHistoryData /> } /> 
              <Route path="/trainNeuralNetwork" element={<TrainNeuralNetwork /> } />
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
                <Route path="/login" element={<Home /> } /> 
                <Route path="/register" element={<Register />} />
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