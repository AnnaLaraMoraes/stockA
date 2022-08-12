import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useContext, createContext } from 'react';
import PropTypes from 'prop-types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

console.log(process.env.APIKEY);

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
