import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import AppRouter from './components/app_router';
import axios from 'axios';
// font awesome global imports: js only supports static imports and we need to support dynamic icons for skills, so we load up the solid library
import { library } from '@fortawesome/fontawesome-svg-core'
// import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas)
library.add(far)

axios.defaults.baseURL = process.env.REACT_APP_DISCOVER_API_HOST 
axios.defaults.withCredentials = true //this sends over the http only cookie for auth


ReactDOM.render(<AppRouter />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
