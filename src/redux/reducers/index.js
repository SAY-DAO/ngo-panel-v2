import { combineReducers } from 'redux';
import CustomizerReducer from './customizerReducer';
import { socialWorkerDetailsReducer, socialWorkerListReducer } from './socialWorkerReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  userLogin: userLoginReducer,
  swDetails: socialWorkerDetailsReducer,
  swAll: socialWorkerListReducer,
});
