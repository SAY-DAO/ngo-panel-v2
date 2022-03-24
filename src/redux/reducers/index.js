import { combineReducers } from 'redux';
import CustomizerReducer from './customizerReducer';
import { ngoByIdReducer, ngoListReducer } from './ngoReducer';
import {
  swDetailsReducer,
  swUpdateIsActiveReducer,
  swListReducer,
  swByIdReducer,
  swUpdateReducer,
  swAddReducer,
} from './socialWorkerReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  userLogin: userLoginReducer,
  swDetails: swDetailsReducer,
  swById: swByIdReducer,
  swAll: swListReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  swStatusUpdate: swUpdateIsActiveReducer,
  swUpdate: swUpdateReducer,
  swAdd: swAddReducer,
});
