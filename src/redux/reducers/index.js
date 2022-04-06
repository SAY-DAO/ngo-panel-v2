import { combineReducers } from 'redux';
import countryListReducer from './countryReducer';
import CustomizerReducer from './customizerReducer';
import {
  ngoByIdReducer,
  ngoListReducer,
  ngoUpdateIsActiveReducer,
  ngoUpdateReducer,
} from './ngoReducer';
import {
  swDetailsReducer,
  swUpdateIsActiveReducer,
  swListReducer,
  swByIdReducer,
  swUpdateReducer,
  swAddReducer,
  swMigrateReducer,
} from './socialWorkerReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  countryList: countryListReducer,
  userLogin: userLoginReducer,
  swDetails: swDetailsReducer,
  swById: swByIdReducer,
  swAll: swListReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  swStatusUpdate: swUpdateIsActiveReducer,
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
  swUpdate: swUpdateReducer,
  ngoUpdate: ngoUpdateReducer,
  swAdd: swAddReducer,
  swMigrate: swMigrateReducer,
});
