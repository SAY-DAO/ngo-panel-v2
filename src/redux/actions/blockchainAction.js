/* eslint-disable import/no-extraneous-dependencies */
import { readContract } from '@wagmi/core';
import { daoApi, publicApi } from '../../apis/sayBase';
import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  SIGNATURE_REQUEST,
  SIGNATURE_FAIL,
  SIGNATURE_SUCCESS,
  SIGNATURE_VERIFICATION_REQUEST,
  SIGNATURE_VERIFICATION_FAIL,
  SIGNATURE_VERIFICATION_SUCCESS,
  WALLET_NONCE_REQUEST,
  WALLET_NONCE_SUCCESS,
  WALLET_NONCE_FAIL,
  WALLET_VERIFY_REQUEST,
  WALLET_VERIFY_SUCCESS,
  WALLET_VERIFY_FAIL,
  WALLET_INFORMATION_REQUEST,
  WALLET_INFORMATION_SUCCESS,
  WALLET_INFORMATION_FAIL,
  USER_SIGNATURES_REQUEST,
  USER_SIGNATURES_SUCCESS,
  USER_SIGNATURES_FAIL,
} from '../constants/daoConstants';
import VerifyVoucherContract from '../../build/contracts/needModule/VerifyVoucher.sol/VerifyVoucher.json';
import network from '../../build/contracts/network-settings.json';

export const fetchNonce = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WALLET_NONCE_REQUEST });
    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
      withCredentials: true,
      crossDomain: true,
    };
    const response = await daoApi.get(`/wallet/nonce/${swInfo.id}/${swInfo.typeId}`, config);
    dispatch({
      type: WALLET_NONCE_SUCCESS,
      payload: response.data,
    });
  } catch (e) {
    dispatch({
      type: WALLET_NONCE_FAIL,
      payload:
        e.response && e.response.data.detail ? e.response.data.detail : e.response.data.message,
    });
  }
};

export const walletVerify = (message, signature) => async (dispatch, getState) => {
  try {
    dispatch({ type: WALLET_VERIFY_REQUEST });

    const {
      userLogin: { userInfo },
      swDetails: { swInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
      withCredentials: true,
    };

    const { data } = await daoApi.post(
      `/wallet/verify/${swInfo.id}/${swInfo.typeId}`,
      {
        message,
        signature,
      },
      config,
    );

    dispatch({
      type: WALLET_VERIFY_SUCCESS,
      payload: data,
    });
  } catch (e) {
    console.log(e.response.statusText);
    dispatch({
      type: WALLET_VERIFY_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : e.response && e.response.statusText
          ? e.response.statusText
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};

export const fetchWalletInformation = () => async (dispatch, getState) => {
  try {
    dispatch({ type: WALLET_INFORMATION_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
      withCredentials: true,
    };

    const { data } = await daoApi.get(`/wallet/personal_information`, config);

    dispatch({
      type: WALLET_INFORMATION_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: WALLET_INFORMATION_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};

export const fetchFamilyNetworks = () => async (dispatch, getState) => {
  try {
    dispatch({ type: FAMILY_NETWORK_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await publicApi.get(`/public/children`, config);

    dispatch({
      type: FAMILY_NETWORK_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: FAMILY_NETWORK_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const fetchUserSignatures = () => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_SIGNATURES_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
    };

    const { data } = await daoApi.get(`/wallet/signatures/${userInfo.id}`, config);

    dispatch({
      type: USER_SIGNATURES_SUCCESS,
      payload: data,
    });
  } catch (e) {
    // check for generic and custom message to return using ternary statement
    dispatch({
      type: USER_SIGNATURES_FAIL,
      payload: e.response && (e.response.status ? e.response : e.response.data.message),
    });
  }
};

export const signTransaction = (values, signer, chainId) => async (dispatch, getState) => {
  try {
    dispatch({ type: SIGNATURE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
      withCredentials: true,
    };

    const request = {
      flaskNeedId: values.flaskNeedId,
      signerAddress: values.address,
      statuses: values.statuses,
      receipts: values.receipts,
      payments: values.payments,
      chainId
    };

    const result1 = await daoApi.post(`/wallet/signature/prepare`, request, config);
    const transaction = result1.data;
    // The named list of all type definitions
    const types = {
      ...transaction.types,
    };

    const signatureHash = await signer.signTypedData({
      domain: transaction.domain,
      types,
      primaryType: 'Voucher',
      message: {
        ...transaction.message,
      },
    });

    const request2 = {
      flaskNeedId: values.flaskNeedId,
      statuses: values.statuses,
      receipts: values.receipts,
      payments: values.payments,
      sayRoles: transaction.sayRoles,
      verifyVoucherAddress: transaction.domain.verifyingContract,
    };

    const result2 = await daoApi.post(
      `/wallet/signature/create/${signatureHash}`,
      request2,
      config,
    );
    const { ipfs, signature } = result2.data;
    dispatch({
      type: SIGNATURE_SUCCESS,
      payload: { transaction, ipfs, signature },
    });
  } catch (e) {
    console.log(e);
    dispatch({
      type: SIGNATURE_FAIL,
      payload:
        e.response && e.response.data.detail
          ? e.response.data.detail
          : e.response && e.response.data.message
          ? e.response.data.message
          : { reason: e.reason, code: e.code }, // metamask signature
    });
  }
};

export const verifySignature = (values, signatureHash) => async (dispatch, getState) => {
  try {
    dispatch({ type: SIGNATURE_VERIFICATION_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        flaskId: userInfo && userInfo.id,
      },
      withCredentials: true,
    };

    const request = {
      flaskNeedId: values.flaskNeedId,
      signerAddress: values.address,
      statuses: values.statuses,
      receipts: values.receipts,
      payments: values.payments,
    };

    const result1 = await daoApi.post(`/wallet/signature/prepare`, request, config);
    const transaction = result1.data;

    const data = await readContract({
      address: network.mainnet.verifyVoucherAddress,
      abi: VerifyVoucherContract.abi,
      functionName: '_verify',
      args: [
        {
          needId: transaction.message.needId,
          title: transaction.message.title,
          category: transaction.message.category,
          paid: transaction.message.paid,
          deliveryCode: transaction.message.deliveryCode,
          child: transaction.message.child,
          signer: transaction.message.signer,
          swSignature: signatureHash, // social worker signature
          role: transaction.message.role,
          content: transaction.message.content,
        },
      ],
      blockTag: 'safe',
    });

    dispatch({
      type: SIGNATURE_VERIFICATION_SUCCESS,
      payload: data,
    });
  } catch (e) {
    dispatch({
      type: SIGNATURE_VERIFICATION_FAIL,
      payload: { e },
    });
  }
};
