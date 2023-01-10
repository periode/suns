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


import Auth from './components/auth/Auth';
import AccountConfirm from './pages/auth/AccountConfirm';
import AccountRecovery from './pages/auth/AccountRecovery';
import AccountRecoveryConfirm from './pages/auth/AccountRecoveryConfirm';
import WelcomeContainer from './components/entrypoints/welcome/WelcomeContainer';
import Archive from './pages/archives/Archive';
import AirContext from './contexts/AirContext';
import Contact from './pages/Contact';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Team from './pages/Team';
import Help from './pages/Help';
import History from './pages/History';
import Community from './pages/Community';
import Home from './pages/Home';

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
  },
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/privacy',
    element: <Privacy/>
  },
  {
    path: '/history',
    element: <History />
  },
  {
    path: '/team',
    element: <Team/>
  },
  {
    path: '/help',
    element: <Help/>
  },
  {
    path: '/contact',
    element: <Contact/>
  },
  {
    path: '/guidelines',
    element: <Community/>
  },
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <AirContext>
      <RouterProvider router={router} />
    </AirContext>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
