/*global document*/

import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { Provider } from 'react-redux';

import App from './components';

import '../styles/main.scss';

const Root = () => (
  <App />
);

ReactDOM.render(
  <Root />,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}