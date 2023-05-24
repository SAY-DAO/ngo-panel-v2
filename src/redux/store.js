import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

const env = process.env.REACT_APP_NODE_ENV;

const userInfo = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: {
    userInfo,
    success: userInfo && true,
  },
};
const store = createStore(
  reducers,
  initialState,
  env === 'development' ? composeWithDevTools(applyMiddleware(thunk)) : applyMiddleware(thunk),
);

export default store;
