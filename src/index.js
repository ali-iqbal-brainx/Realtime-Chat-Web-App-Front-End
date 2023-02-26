import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './components/Login';
import SignUp from './components/SignUp';
import DashBoard from './components/DashBoard';
import ProfileSetup from './components/ProfileSetup';
import CreateJoin from './components/CreateJoin';
import Verification from './components/Verification';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Verification />
  </React.StrictMode>
);