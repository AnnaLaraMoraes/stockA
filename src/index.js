import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './static/fonts/Courgette-Regular.ttf';
import './static/fonts/HelveticaNeueLTStd.otf';
import './styles/global.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
