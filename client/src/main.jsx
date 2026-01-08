import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import { AuthLayout } from './components/index.js';

import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import Mindfullness from './pages/Mindfullness.jsx'
import Contact from './pages/Contact.jsx';
import About from './pages/About.jsx';
import Journal from './pages/Journal.jsx';
import MoodLogs from './pages/MoodLogs.jsx';
import AIChat from './pages/AIChat.jsx';
import MoodAnalytics from './pages/MoodAnalytics.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/login',
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '/signup',
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <AuthLayout authentication>
            <Dashboard />
          </AuthLayout>
        ),
      },
      {
        path: '/profile',
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: '/journal',
        element: (
          <AuthLayout authentication>
            <Journal />
          </AuthLayout>
        ),
      },
      {
        path: '/mood-logs',
        element: (
          <AuthLayout authentication>
            <MoodLogs />
          </AuthLayout>
        ),
      },
      {
        path: '/chat',
        element: (
          <AuthLayout authentication>
            <AIChat />
          </AuthLayout>
        ),
      },
      {
        path: '/mindfulness',
        element: (
          <AuthLayout authentication>
            <Mindfullness />
          </AuthLayout>
        ),
      },
      {
        path: '/contact',
        element: (
          <AuthLayout authentication>
            <Contact />
          </AuthLayout>
        ),
      },
      {
        path: '/about',
        element: (
          <AuthLayout authentication>
            <About />
          </AuthLayout>
        ),
      },
      {
        path: '/analytics/mood',
        element: (
          <AuthLayout authentication>
            <MoodAnalytics />
          </AuthLayout>
        ),
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
