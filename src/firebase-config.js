import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect, useContext, createContext } from 'react';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_APPID,
};

const app = initializeApp(firebaseConfig);

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    window.localStorage.getItem('auth') === 'true' || false
  );

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem('auth', 'true');
        window.localStorage.setItem('token', await userCred.getIdToken());
        window.localStorage.setItem('useruid', userCred.uid);
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
  return { ...auth, isAuthenticated: auth.user };
};

export const auth = getAuth(app);
