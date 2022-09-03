import { ethers } from 'ethers';
import { daoApi, publicApi } from '../../../apis/sayBase';
import {
  FAMILY_NETWORK_REQUEST,
  FAMILY_NETWORK_SUCCESS,
  FAMILY_NETWORK_FAIL,
  WALLET_CONNECT_REQUEST,
  WALLET_CONNECT_SUCCESS,
  WALLET_CONNECT_FAIL,
  UPDATE_SERVER_REQUEST,
  UPDATE_SERVER_SUCCESS,
  UPDATE_SERVER_FAIL,
  GET_SERVER_NEEDS_REQUEST,
  GET_SERVER_NEEDS_SUCCESS,
  GET_SERVER_NEEDS_FAIL,
  UPDATE_FLASK_REQUEST,
  GET_SERVER_CHILDREN_REQUEST,
  GET_SERVER_CHILDREN_SUCCESS,
  GET_SERVER_CHILDREN_FAIL,
} from '../../constants/daoConstants';

export const updateNestServer = (counter, skip) => async (dispatch, getState) => {
  let child = {};
  let need = {};
  const childList = [];
  const needList = [];
  try {
    dispatch({ type: UPDATE_FLASK_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.access_token,
        'X-SKIP': skip,
        'X-TAKE': counter, // pagination
      },
    };
    const { data } = await publicApi.get(`/needs`, config);
    const response = await publicApi.get(`/child/all/confirm=1`, config);
    dispatch({ type: UPDATE_SERVER_REQUEST });

    for (let i = 0; i < data.needs.length; i++) {
      need = {
        need_id: data.needs[i].id,
        title: data.needs[i].name,
        affiliateLinkUrl: data.needs[i].affiliateLinkUrl,
        bank_track_id: data.needs[i].bank_track_id,
        category: data.needs[i].category,
        childGeneratedCode: data.needs[i].childGeneratedCode,
        childSayName: data.needs[i].childSayName,
        child_delivery_date: data.needs[i].child_delivery_date,
        child_id: data.needs[i].child_id,
        confirmDate: data.needs[i].confirmDate,
        confirmUser: data.needs[i].confirmUser,
        cost: data.needs[i].cost,
        created: data.needs[i].created,
        created_by_id: data.needs[i].created_by_id,
        deleted_at: data.needs[i].deleted_at,
        description: data.needs[i].description,
        description_translations: data.needs[i].description_translations, // { en: '' , fa: ''}
        title_translations: data.needs[i].name_translations, // { en: '' , fa: ''}
        details: data.needs[i].details,
        doing_duration: data.needs[i].doing_duration,
        donated: data.needs[i].donated,
        doneAt: data.needs[i].doneAt,
        expected_delivery_date: data.needs[i].expected_delivery_date,
        informations: data.needs[i].informations,
        isConfirmed: data.needs[i].isConfirmed,
        isDeleted: data.needs[i].isDeleted,
        isDone: data.needs[i].isDone,
        isReported: data.needs[i].isReported,
        isUrgent: data.needs[i].isUrgent,
        ngoId: data.needs[i].ngoId,
        ngoAddress: data.needs[i].ngoAddress,
        ngoName: data.needs[i].ngoName,
        ngo_delivery_date: data.needs[i].ngo_delivery_date,
        oncePurchased: data.needs[i].oncePurchased,
        paid: data.needs[i].paid,
        purchase_cost: data.needs[i].purchase_cost,
        purchase_date: data.needs[i].purchase_date,
        receipt_count: data.needs[i].receipt_count,
        receipts: data.needs[i].receipts,
        status: data.needs[i].status,
        status_description: data.needs[i].status_description,
        status_updated_at: data.needs[i].status_updated_at,
        type: data.needs[i].type,
        type_name: data.needs[i].type_name,
        unavailable_from: data.needs[i].unavailable_from,
        unconfirmed_at: data.needs[i].unconfirmed_at,
        unpaid_cost: data.needs[i].unpaid_cost,
        unpayable: data.needs[i].unpayable,
        unpayable_from: data.needs[i].unpayable_from,
        updated: data.needs[i].updated,
        payments: data.needs[i].payments, // []
        imageUrl: data.needs[i].imageUrl,
        need_retailer_img: data.needs[i].img,
      };
      needList.push(need);
    }
    for (let i = 0; i < response.data.children.length; i++) {
      child = {
        child_id: response.data.children[i].id,
        address: response.data.children[i].address,
        avatarUrl: response.data.children[i].avatarUrl,
        awakeAvatarUrl: response.data.children[i].awakeAvatarUrl,
        bio: response.data.children[i].bio,
        bioSummary: response.data.children[i].bioSummary,
        bio_summary_translations: response.data.children[i].bio_summary_translations,
        bio_translations: response.data.children[i].bio_translations,
        birthDate: response.data.children[i].birthDate,
        birthPlace: response.data.children[i].birthPlace,
        city: response.data.children[i].city,
        confirmDate: response.data.children[i].confirmDate,
        confirmUser: response.data.children[i].confirmUser,
        country: response.data.children[i].country,
        created: response.data.children[i].created,
        done_needs_count: response.data.children[i].done_needs_count,
        education: response.data.children[i].education,
        existence_status: response.data.children[i].existence_status,
        familyCount: response.data.children[i].familyCount,
        generatedCode: response.data.children[i].generatedCode,
        housingStatus: response.data.children[i].housingStatus,
        id_ngo: response.data.children[i].id_ngo,
        id_social_worker: response.data.children[i].id_social_worker,
        isConfirmed: response.data.children[i].isConfirmed,
        isDeleted: response.data.children[i].isDeleted,
        isMigrated: response.data.children[i].isMigrated,
        is_gone: response.data.children[i].is_gone,
        migrateDate: response.data.children[i].migrateDate,
        migratedId: response.data.children[i].migratedId,
        nationality: response.data.children[i].nationality,
        sayFamilyCount: response.data.children[i].sayFamilyCount,
        sayName: response.data.children[i].sayName,
        sayname_translations: response.data.children[i].sayname_translations,
        sleptAvatarUrl: response.data.children[i].sleptAvatarUrl,
        status: response.data.children[i].status,
        updated: response.data.children[i].updated,
        voiceUrl: response.data.children[i].voiceUrl,
      };
      childList.push(child);
    }

    const needRequest = {
      totalCount: data.totalCount,
      totalChildCount: response.data.totalCount,
      needData: needList,
      childData: childList,
    };
    console.log(needRequest);

    const nestResponse = await daoApi.post(`/sync/update`, needRequest);
    dispatch({
      type: UPDATE_SERVER_SUCCESS,
      payload: nestResponse,
    });
  } catch (e) {
    dispatch({
      type: UPDATE_SERVER_FAIL,
      payload: e.response && e.response.data.detail ? e.response.data.detail : e.message,
    });
  }
};

export const fetchNestNeeds = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_NEEDS_REQUEST });

    const responseNeed = await daoApi.get(`/needs/all`);

    dispatch({
      type: GET_SERVER_NEEDS_SUCCESS,
      payload: { needs: responseNeed.data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_NEEDS_FAIL,
      payload: e.response && e.response.data.detail ? e.response.data.detail : e.message,
    });
  }
};

export const fetchNestChildren = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SERVER_CHILDREN_REQUEST });

    const responseChild = await daoApi.get(`/children/all`);

    dispatch({
      type: GET_SERVER_CHILDREN_SUCCESS,
      payload: { children: responseChild.data },
    });
  } catch (e) {
    dispatch({
      type: GET_SERVER_CHILDREN_FAIL,
      payload: e.response && e.response.data.detail ? e.response.data.detail : e.message,
    });
  }
};

export const connectWallet = () => async (dispatch) => {
  try {
    dispatch({ type: WALLET_CONNECT_REQUEST });

    // eslint-disable-next-line no-undef
    await window.ethereum.enable();
    // eslint-disable-next-line no-undef
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const walletAddress = await signer.getAddress();

    dispatch({
      type: WALLET_CONNECT_SUCCESS,
      payload: walletAddress,
    });
  } catch (e) {
    dispatch({
      type: WALLET_CONNECT_FAIL,
      payload: e.response && e.response.data.detail ? e.response.data.detail : e.message,
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
        'Content-type': 'application/json',
        Authorization: userInfo && userInfo.accessToken,
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
      payload: e.response && e.response.status ? e.response : e.message,
    });
  }
};

// export const signTransaction =
//   (needId, needTitle, needImage, userId, impacts) => async (dispatch, getState) => {
//     try {
//       dispatch({ type: SIGNATURE_REQUEST });

//       await window.ethereum.enable();
//       // eslint-disable-next-line no-undef
//       const provider = new ethers.providers.Web3Provider(window.ethereum);
//       const signer = provider.getSigner();
//       const signerAddress = await signer.getAddress();
//       // const theSellingPrice_BN = ethers.utils.parseUnits(
//       //   price.toString(),
//       //   'ether'
//       // );

//       const VerifySignature = new ethers.ContractFactory(
//         VerifyVoucher.abi,
//         VerifyVoucher.bytecode,
//         signer,
//       );

//       const signerContract = VerifySignature.attach('0x004a0304523554961578f2b7050BDFdE57625228');

//       const theSignature = new Signature({ contract: signerContract, signer });

//       console.log(signerAddress, needId, needTitle, needImage, userId, impacts);
//       const voucher = await theSignature.signTransaction(
//         signerAddress,
//         needId,
//         needTitle,
//         needImage,
//         userId,
//         impacts,
//       );

//       const {
//         userLogin: { userInfo },
//       } = getState();

//       const config = {
//         headers: {
//           'Content-type': 'application/json',
//           Authorization: userInfo && userInfo.accessToken,
//         },
//         data: {
//           signature: voucher.signature, // This is the body part
//         },
//       };
//       const { data } = await daoApi.post(`/signature/add`, config);

//       dispatch({
//         type: SIGNATURE_SUCCESS,
//         payload: { data, voucher, signerAddress },
//       });
//     } catch (e) {
//       // check for generic and custom message to return using ternary statement
//       dispatch({
//         type: SIGNATURE_FAIL,
//         payload: e.response && e.response.status ? e.response : e.message,
//       });
//     }
//   };
