import React, { Suspense } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';
import App from './App';
import store from './redux/store';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import Spinner from './pages/spinner/Spinner';
import './i18n';
import './resources/styles/css/style.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // createRoot(container!) if you use TypeScript

root.render(
  <Provider store={store}>
    <Suspense fallback={<Spinner />}>
      <HashRouter>
        <App />
      </HashRouter>
    </Suspense>
  </Provider>,
);

// If you want to enable client cache, register instead.
if (process.env.REACT_APP_NODE_ENV === 'production') {
  serviceWorker.register();
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
