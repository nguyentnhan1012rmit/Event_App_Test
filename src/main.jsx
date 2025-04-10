import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="607673948487-cade6s5bpltf73gg56us69ft0l7ndr94.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
