import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import {ManagedContext} from './lib/context';

ReactDOM.render(
  <React.StrictMode>
    <ManagedContext>
      <App />
    </ManagedContext>
  </React.StrictMode>,
  document.getElementById('root'),
);
