import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import { AuthContextProvider } from './firebase-config';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
