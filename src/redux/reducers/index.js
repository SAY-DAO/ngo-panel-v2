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
  childNameCheckReducer,
  childPreRegisterReducer,
  childrenByNgoReducer,
  childSayNameReducer,
  childUpdateReducer,
  childUpdateStatusReducer,
} from './childrenReducer';
import { userLoginReducer, myPageReducer, userChangePasswordReducer } from './userReducer';
import {
  allNeedsReducer,
  allReportNeedsReducer,
  childNeedsReducer,
  childOneNeedReducer,
  deleteOldNeedsReducer,
  duplicatesReducer,
  exampleNeedsReducer,
  needAddReducer,
  needConfirmReducer,
  needStatusUpdateReducer,
  needUpdateReducer,
  swNeedListReducer,
  unconfirmedReducer,
} from './needReducer';
import { receiptAddReducer, receiptDeleteReducer, receiptsListReducer } from './reportReducer';
import {
  contributionReducer,
  signatureReducer,
  signatureVerificationReducer,
  userSignaturesReducer,
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
  analyticsFamilyReducer,
  analyticsNgosReducer,
} from './analyticReducer';
import { midjourneyReducer } from './midjourneyReducer';
import { commentsReducer } from './commentReducer';

export default combineReducers({
  CustomizerReducer,
  commentResult: commentsReducer,
  ecoContribution: contributionReducer,
  familyAnalyitics: analyticsFamilyReducer,
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
  signature: signatureReducer,
  signaturesVerification: signatureVerificationReducer,
  signatures: userSignaturesReducer,
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
  childExampleNeeds: exampleNeedsReducer,
  childNeeds: childNeedsReducer,
  childOneNeed: childOneNeedReducer,
  childById: childByIdReducer,
  childAllActives: childActiveListReducer,
  childAll: childListReducer,
  childrenByNgo: childrenByNgoReducer,
  childUpdate: childUpdateReducer,
  childAdd: childAddReducer,
  childNeedsDuplicates: duplicatesReducer,
  childStatusUpdate: childUpdateStatusReducer,
  childNameCheck: childNameCheckReducer,
  childPreRegister: childPreRegisterReducer,
  childAllNames: childSayNameReducer,
  allNeeds: allNeedsReducer,
  allReportNeeds: allReportNeedsReducer,
  needConfirm: needConfirmReducer,
  needUnConfirmCount: unconfirmedReducer,
  needUpdate: needUpdateReducer,
  needStatusUpdate: needStatusUpdateReducer,
  needAdd: needAddReducer,
  ngoStatusUpdate: ngoUpdateIsActiveReducer,
  ngoById: ngoByIdReducer,
  ngoAll: ngoListReducer,
  ngoArrivals: ngoArrivalReducer,
  ngoUpdate: ngoUpdateReducer,
  ngoAdd: ngoAddReducer,
  ngoDelete: ngoDeleteReducer,
  receiptList: receiptsListReducer,
  receiptDelete: receiptDeleteReducer,
  receiptAdd: receiptAddReducer,
  providerStatusUpdate: providerUpdateIsActiveReducer,
  providerById: providerByIdReducer,
  providerAll: providerListReducer,
  providerUpdate: providerUpdateReducer,
  providerAdd: providerAddReducer,
  providerDelete: providerDeleteReducer,
  mileStone: milestoneReducer,
  midjourney: midjourneyReducer,
  deletedOld: deleteOldNeedsReducer,
});
