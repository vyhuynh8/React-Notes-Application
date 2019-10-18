import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';


const firebase = require('firebase');
require('firebase/firestore');

firebase.initializeApp({
//creds here
  });

ReactDOM.render(<App />, document.getElementById('notes-app'));

serviceWorker.unregister();
