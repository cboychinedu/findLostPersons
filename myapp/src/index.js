// Importing the necessary modules 
import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './App'; 
import "./index.css"; 
import { AuthContextProvider } from './Auth/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <AuthContextProvider>
      <App /> 
    </AuthContextProvider>
);
