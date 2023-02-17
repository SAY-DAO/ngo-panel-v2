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
<<<<<<< Updated upstream
import { userLoginReducer } from './userReducer';

export default combineReducers({
  CustomizerReducer,
=======
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
  allReportNeedsReducer,
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
  signatureReducer,
  walletReducer,
} from './blockchainReducer';
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
  wallet: walletReducer,
  countryList: countryListReducer,
  myPage: myPageReducer,
>>>>>>> Stashed changes
  userLogin: userLoginReducer,
  swDetails: swDetailsReducer,
  swById: swByIdReducer,
  swAll: swListReducer,
<<<<<<< Updated upstream
=======
  swUpdate: swUpdateReducer,
  swAdd: swAddReducer,
  swMigrate: swMigrateReducer,
  swOneMigrate: swMigrateOneReducer,
  swNeedList: swNeedListReducer,
  swDelete: swDeleteReducer,
  allNeeds: allNeedsReducer,
  allReportNeeds: allReportNeedsReducer,
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
  signature: signatureReducer,
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
>>>>>>> Stashed changes
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  swStatusUpdate: swUpdateIsActiveReducer,
  swUpdate: swUpdateReducer,
  swAdd: swAddReducer,
});
