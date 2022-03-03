import { combineReducers } from 'redux';
import CustomizerReducer from './customizerReducer';
import { userDetailsReducer, userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  userLogin: userLoginReducer,
  userDetails: userDetailsReducer,
});
