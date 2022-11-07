import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Auth from './components/auth/Auth';
import NotFound from './NotFound';
import About from './About';
import AccountConfirm from './pages/auth/AccountConfirm';
import AccountRecovery from './pages/auth/AccountRecovery';
import AccountRecoveryConfirm from './pages/auth/AccountRecoveryConfirm';

const router = createBrowserRouter([
  {
    path: '/',
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
