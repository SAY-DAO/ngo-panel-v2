import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  SIGNATURE_REQUEST,
  SIGNATURE_SUCCESS,
  SIGNATURE_FAIL,
  SIGNATURE_RESET,
  WALLET_NONCE_REQUEST,
  WALLET_NONCE_SUCCESS,
  WALLET_NONCE_FAIL,
  WALLET_VERIFY_REQUEST,
  WALLET_VERIFY_SUCCESS,
  WALLET_VERIFY_FAIL,
  WALLET_INFORMATION_REQUEST,
  WALLET_INFORMATION_SUCCESS,
  WALLET_INFORMATION_FAIL,
  WALLET_VERIFY_RESET,
  WALLET_INFORMATION_RESET,
  USER_SIGNATURES_REQUEST,
  USER_SIGNATURES_SUCCESS,
  USER_SIGNATURES_FAIL,
} from '../constants/daoConstants';

export const walletNonceReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_NONCE_REQUEST:
      return { loading: true, success: false };
    case WALLET_NONCE_SUCCESS:
      return { loading: false, success: true, nonceData: action.payload };
    case WALLET_NONCE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const walletVerifyReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_VERIFY_REQUEST:
      return { loading: true, success: false };
    case WALLET_VERIFY_SUCCESS:
      return { loading: false, success: true, verifiedNonce: action.payload };
    case WALLET_VERIFY_FAIL:
      return { loading: false, error: action.payload };
    case WALLET_VERIFY_RESET:
      return {};
    default:
      return state;
  }
};
export const WalletInformationReducer = (state = {}, action) => {
  switch (action.type) {
    case WALLET_INFORMATION_REQUEST:
      return { loading: true, success: false };
    case WALLET_INFORMATION_SUCCESS:
      return { loading: false, success: true, information: action.payload };
    case WALLET_INFORMATION_FAIL:
      return { loading: false, error: action.payload };
    case WALLET_INFORMATION_RESET:
      return {};
    default:
      return state;
  }
};

export const familyNetworksReducer = (state = {}, action) => {
  switch (action.type) {
    case FAMILY_NETWORK_REQUEST:
      return { loading: true, success: false };
    case FAMILY_NETWORK_SUCCESS:
      return { loading: false, success: true, network: action.payload };
    case FAMILY_NETWORK_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const signatureReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGNATURE_REQUEST:
      return { loading: true, success: false };
    case SIGNATURE_SUCCESS:
      return {
        loading: false,
        success: true,
        signature: action.payload.signature,
        ipfs: action.payload.ipfs,
        transaction: action.payload.transaction,
      };
    case SIGNATURE_FAIL:
      return { loading: false, error: action.payload };
    case SIGNATURE_RESET:
      return {};
    default:
      return state;
  }
};

export const userSignaturesReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNATURES_REQUEST:
      return { loading: true, success: false };
    case USER_SIGNATURES_SUCCESS:
      return {
        loading: false,
        success: true,
        userSignatures: action.payload,
      };
    case USER_SIGNATURES_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
