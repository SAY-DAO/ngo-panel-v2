import { combineReducers } from 'redux';
import countryListReducer from './countryReducer';
import CustomizerReducer from './customizerReducer';
import {
  ngoAddReducer,
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
  swNeedListReducer,
} from './socialWorkerReducer';
import {
  childAddReducer,
  childByIdReducer,
  childListReducer,
  childNeedsReducer,
  childUpdateReducer,
} from './childrenReducer';
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
  countryList: countryListReducer,
  userLogin: userLoginReducer,
  swDetails: swDetailsReducer,
  swById: swByIdReducer,
  swStatusUpdate: swUpdateIsActiveReducer,
  swAll: swListReducer,
  swUpdate: swUpdateReducer,
  swAdd: swAddReducer,
  swMigrate: swMigrateReducer,
  swNeedList: swNeedListReducer,
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  ngoUpdate: ngoUpdateReducer,
  ngoAdd: ngoAddReducer,
  childNeeds: childNeedsReducer,
  childById: childByIdReducer,
  childAll: childListReducer,
  childUpdate: childUpdateReducer,
  childAdd: childAddReducer,
});
