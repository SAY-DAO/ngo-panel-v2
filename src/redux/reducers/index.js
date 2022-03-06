import { combineReducers } from 'redux';
import CustomizerReducer from './customizerReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  userLogin: userLoginReducer,
});
