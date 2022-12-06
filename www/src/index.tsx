import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import NotFound from './NotFound';

import About from './About';

import Auth from './components/auth/Auth';
import AccountConfirm from './pages/auth/AccountConfirm';
import AccountRecovery from './pages/auth/AccountRecovery';
import AccountRecoveryConfirm from './pages/auth/AccountRecoveryConfirm';
import SignUp from './pages/auth/SignUp';
import WelcomeContainer from './components/entrypoints/welcome/WelcomeContainer';
import Entrypoint from './components/entrypoints/Entrypoint';
import Archive from './pages/archives/Archive';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App/>,
  },
  {
    path: '/auth',
    element: <Auth />
  },
  {
    path: '/auth/confirm',
    element: <AccountConfirm />
  },
  {
    path: '/auth/lost-password',
    element: <AccountRecovery/>
  },
  {
    path: '/auth/recover',
    element: <AccountRecoveryConfirm/>
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/welcome',
    element: <WelcomeContainer />
  },
  {
    path: '/entrypoints/*',
    element: <App />
  },
  {
    path: '/archive/:id',
    element: <Archive/>
  },
  {
    path: "*",
    element: <NotFound />
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
