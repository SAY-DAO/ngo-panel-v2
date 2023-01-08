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
  childActiveListReducer,
  childAddReducer,
  childByIdReducer,
  childListReducer,
  childrenByNgoReducer,
  childUpdateReducer,
} from './childrenReducer';
import { userLoginReducer, myPageReducer } from './userReducer';
import {
  allNeedsReducer,
  childNeedsReducer,
  childOneNeedReducer,
  exampleNeedsReducer,
  needAddReducer,
  needStatusUpdateReducer,
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
import {
  providerAddReducer,
  providerByIdReducer,
  providerDeleteReducer,
  providerListReducer,
  providerUpdateIsActiveReducer,
  providerUpdateReducer,
} from './providerReducer';

export default combineReducers({
  CustomizerReducer,
  countryList: countryListReducer,
  myPage: myPageReducer,
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
  allNeeds: allNeedsReducer,
  childExampleNeeds: exampleNeedsReducer,
  childNeeds: childNeedsReducer,
  childOneNeed: childOneNeedReducer,
  childById: childByIdReducer,
  mileStone: mileStoneReducer,
  needUpdate: needUpdateReducer,
  needStatusUpdate: needStatusUpdateReducer,
  needAdd: needAddReducer,
  childAllActives: childActiveListReducer,
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
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  ngoUpdate: ngoUpdateReducer,
  ngoAdd: ngoAddReducer,
  ngoDelete: ngoDeleteReducer,
  providerStatusUpdate: providerUpdateIsActiveReducer,
  providerById: providerByIdReducer,
  providerAll: providerListReducer,
  providerUpdate: providerUpdateReducer,
  providerAdd: providerAddReducer,
  providerDelete: providerDeleteReducer,
});
