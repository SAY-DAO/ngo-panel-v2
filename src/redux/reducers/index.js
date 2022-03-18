import { combineReducers } from 'redux';
import CustomizerReducer from './customizerReducer';
import { swDetailsReducer, swUpdateIsActiveReducer, swListReducer, swByIdReducer } from './socialWorkerReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  userLogin: userLoginReducer,
  swDetails: swDetailsReducer,
  swById:swByIdReducer,
  swAll: swListReducer,
  swStatus: swUpdateIsActiveReducer,
});
