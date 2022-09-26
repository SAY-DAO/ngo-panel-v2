import { combineReducers } from 'redux';
import countryListReducer from './countryReducer';
import CustomizerReducer from './customizerReducer';
import {
  ngoAddReducer,
  ngoByIdReducer,
  ngoDeleteReducer,
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
  swMigrateOneReducer,
} from './socialWorkerReducer';
import {
  childAddReducer,
  childByIdReducer,
  childListReducer,
  childrenByNgoReducer,
  childUpdateReducer,
} from './childrenReducer';
import { userLoginReducer } from './userReducer';
import {
  allNeedsReducer,
  childNeedsReducer,
  childOneNeedReducer,
  exampleNeedsReducer,
  needAddReducer,
  needUpdateReducer,
  swNeedListReducer,
} from './needReducer';
import { receiptAddReducer, receiptDeleteReducer, receiptsListReducer } from './reportReducer';
import {
  mileStoneReducer,
  serverOneNeedReducer,
  serverReducer,
  signatureReducer,
} from './daoReducer';

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
  swOneMigrate: swMigrateOneReducer,
  swNeedList: swNeedListReducer,
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  ngoUpdate: ngoUpdateReducer,
  ngoAdd: ngoAddReducer,
  ngoDelete: ngoDeleteReducer,
  allNeeds: allNeedsReducer,
  childExampleNeeds: exampleNeedsReducer,
  childNeeds: childNeedsReducer,
  childOneNeed: childOneNeedReducer,
  childById: childByIdReducer,
  mileStone: mileStoneReducer,
  needUpdate: needUpdateReducer,
  needAdd: needAddReducer,
  childAll: childListReducer,
  childrenByNgo: childrenByNgoReducer,
  childUpdate: childUpdateReducer,
  childAdd: childAddReducer,
  receiptList: receiptsListReducer,
  receiptDelete: receiptDeleteReducer,
  receiptAdd: receiptAddReducer,
  server: serverReducer,
  serverOneNeed: serverOneNeedReducer,
  signature: signatureReducer,
});
