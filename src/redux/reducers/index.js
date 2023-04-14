import { combineReducers } from 'redux';
import countryListReducer from './countryReducer';
import CustomizerReducer from './customizerReducer';
import {
  ngoAddReducer,
  ngoArrivalReducer,
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
  swDeleteReducer,
} from './socialWorkerReducer';
import {
  childActiveListReducer,
  childAddReducer,
  childByIdReducer,
  childListReducer,
  childrenByNgoReducer,
  childUpdateReducer,
} from './childrenReducer';
import { userLoginReducer, myPageReducer, userChangePasswordReducer } from './userReducer';
import {
  allNeedsReducer,
  allReportNeedsReducer,
  childNeedsReducer,
  childOneNeedReducer,
  exampleNeedsReducer,
  needAddReducer,
  needConfirmReducer,
  needStatusUpdateReducer,
  needUpdateReducer,
  swNeedListReducer,
} from './needReducer';
import { receiptAddReducer, receiptDeleteReducer, receiptsListReducer } from './reportReducer';
import {
  signatureReducer,
  WalletInformationReducer,
  walletNonceReducer,
  walletVerifyReducer,
} from './blockchainReducer';
import {
  providerAddReducer,
  providerByIdReducer,
  providerDeleteReducer,
  providerListReducer,
  providerUpdateIsActiveReducer,
  providerUpdateReducer,
} from './providerReducer';
import {
  ticketListReducer,
  ticketAddReducer,
  ticketAddMsgReducer,
  ticketByIdReducer,
  ticketUpdateReducer,
} from './ticketReducer';
import { milestoneReducer } from './milestoneReducer';
import {
  AnalyticChildNeedsReducer,
  analyticsContributionReducer,
  analyticsEcosystemReducer,
  analyticsNgosReducer,
} from './analyticReducer';

export default combineReducers({
  CustomizerReducer,
  childNeedsAnalytics: AnalyticChildNeedsReducer,
  ngosAnalytics: analyticsNgosReducer,
  contributionAnalytics: analyticsContributionReducer,
  ecosystemAnalytics: analyticsEcosystemReducer,
  myTickets: ticketListReducer,
  ticketMsgAdd: ticketAddMsgReducer,
  ticketAdd: ticketAddReducer,
  ticketUpdate: ticketUpdateReducer,
  ticketById: ticketByIdReducer,
  walletNonce: walletNonceReducer,
  walletVerify: walletVerifyReducer,
  walletInformation: WalletInformationReducer,
  countryList: countryListReducer,
  myPage: myPageReducer,
  userLogin: userLoginReducer,
  changePassword: userChangePasswordReducer,
  swDetails: swDetailsReducer,
  swById: swByIdReducer,
  swStatusUpdate: swUpdateIsActiveReducer,
  swAll: swListReducer,
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
  needConfirm: needConfirmReducer,
  childById: childByIdReducer,
  mileStone: milestoneReducer,
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
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  ngoArrivals: ngoArrivalReducer,
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
