import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const firebaseConfig = {
  apiKey: 'AIzaSyAXUHy_xl0a1MqJPI8NGDIN1gPy3ivl0sU',
  authDomain: 'stocka-405e8.firebaseapp.com',
  projectId: 'stocka-405e8',
  storageBucket: 'stocka-405e8.appspot.com',
  messagingSenderId: '252988286743',
  appId: '1:252988286743:web:a34a04ea4d69a7f321b952',
};

const app = initializeApp(firebaseConfig);

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    false || window.localStorage.getItem('auth') === 'true'
  );

  useEffect(() => {
    onAuthStateChanged(getAuth(), (userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem('auth', 'true');
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user: auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthState = () => {
  const auth = useContext(AuthContext);
  return { ...auth, isAuthenticated: auth?.user != null };
};

export const auth = getAuth(app);

AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
