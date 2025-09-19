// importing the necessary modules 
import { Component } from 'react';
import Home from "./Pages/Home/Home";
import { AuthContext } from './Auth/AuthContext';
import Register from "./Pages/Register/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Setting the token variable 
let tokenValue = localStorage.getItem("xAuthToken") || null; 

// If the token exists, set it in the AuthContext
// if (tokenValue) {
//   AuthContext._currentValue.setToken(tokenValue); 
// }

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
    }, 3000); 
  }

  // Lifecycle method equivalent to the cleanup function in useEffect
  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  // render method to return the JSX
  render() {
    // Note: The 'loading' state is not used in the final JSX, but the logic is maintained for demonstration
    const { loading } = this.state; 

    // Getting the context data 
    const { isLoggedIn, xAuthToken, setToken } = this.context;
    
    // Returning the JSX component 
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/register" element={<Register /> } /> 

          {isLoggedIn && xAuthToken ? (
            <> 
              <Route path="/dashboard" element={<div>Dashboard Component</div>} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Home />} />
              <Route path="*" element={<Home />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    );
  }
}

// exporting the app component 
export default App;