import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import './static/fonts/Courgette-Regular.ttf';
import './static/fonts/HelveticaNeueLTStd.otf';
import './styles/global.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
