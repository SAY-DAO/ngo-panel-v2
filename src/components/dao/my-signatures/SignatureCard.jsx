import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  Avatar,
  Box,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
  CardActionArea,
} from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAccount, useNetwork } from 'wagmi';
import { useTranslation } from 'react-i18next';
import { prepareUrl, shortenWallet } from '../../../utils/helpers';
import { verifySignature } from '../../../redux/actions/blockchainAction';

const SignatureCard = ({ signature, need }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [cardAddress, setCardAddress] = useState();
  const [images, setImages] = useState(false);

  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const signaturesVerification = useSelector((state) => state.signaturesVerification);
  const { verifiedData, loading: loadingSignaturesVerification } = signaturesVerification;

  useEffect(() => {
    if (verifiedData && verifiedData.flaskNeedId === need.flaskId) {
      setCardAddress(verifiedData.verifiedAddress);
    }
  }, [verifiedData]);

  const handleVerifySignature = () => {
    dispatch(
      verifySignature(
        {
          chainId: chain?.id,
          flaskNeedId: need.flaskId,
          signerAddress: need.signature.signerAddress,
          statuses: need.statusUpdates,
          receipts: need.receipts,
          payments: need.verifiedPayments,
        },
        signature.hash,
      ),
    );
  };

  const handleImageSwipe = () => {
    if (images === true) {
      setImages(false);
    } else {
      setImages(true);
    }
  };
  return (
    <div>
      {isConnected && (
        <div style={{ position: 'absolute', zIndex: 10, right: 12, top: 8 }}>
          {loadingSignaturesVerification ? (
            <Grid container>
              <CircularProgress size={15} sx={{ m: 'auto' }} />
            </Grid>
          ) : (
            !cardAddress && (
              <Tooltip title="verify signature">
                <IconButton onClick={handleVerifySignature}>
                  <ReplayIcon sx={{ color: 'grey' }} />
                </IconButton>
              </Tooltip>
            )
          )}
        </div>
      )}
      <CardActionArea onClick={handleImageSwipe}>
        <Card
          elevation={3}
          sx={{
            p: 0,
            borderRadius: 8,
            height: 170,
            width: 150,
            background: images
              ? `url(${`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.midjourneyImage}`})`
              : `url(${need.needRetailerImg})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            position: 'relative',
          }}
        >
          {cardAddress && (
            <Typography
              sx={{
                bgcolor:
                  !signature.need.socialWorker ||
                  !signature.need.socialWorker.wallets ||
                  !signature.need.socialWorker.wallets[0] ||
                  !signature.need.socialWorker.wallets.find((w) => w.address === cardAddress)
                    ? 'red'
                    : 'green',
                textAlign: 'center',
                fontWeight: 400,
              }}
            >
              {shortenWallet(cardAddress)}
            </Typography>
          )}

          <Grid
            container
            justifyContent="flex-start"
            alignItems="flex-start"
            sx={{ zIndex: 10, position: 'absolute', bottom: 5 }}
          >
            <Grid item xs={4}>
              <Avatar
                alt="my child"
                sx={{ width: 35, height: 35, m: 'auto' }}
                src={prepareUrl(need.child.awakeAvatarUrl)}
              />
            </Grid>
            <Grid item xs sx={{ maxWidth: '100%' }}>
              <Typography sx={{ color: 'white', fontWeight: 400 }} fontSize="small">
                {need.child.sayNameTranslations.fa}
              </Typography>
              {successNgoList && (
                <Typography
                  sx={{
                    maxWidth: '90px !important',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    height: '1.2em',
                    whiteSpace: 'nowrap',
                  }}
                  fontSize="small"
                >
                  {ngoList.find((ngo) => Number(ngo.id) === need.flaskNgoId)
                    ? ngoList.find((ngo) => Number(ngo.id) === need.flaskNgoId).name
                    : ''}
                </Typography>
              )}

              <Typography sx={{ color: 'white', fontWeight: 400 }} fontSize="small">
                {need.socialWorker.firstName} {need.socialWorker.lastName}
              </Typography>
            </Grid>
          </Grid>
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: 70,
              bgcolor: 'black',
              opacity: 0.38,
            }}
          />
          {images && !need.midjourneyImage && (
            <Grid container>
              <Typography
                sx={{
                  position: 'absolute',
                  color: 'white',
                  fontWeight: 200,
                  p: 2,
                  top: 50,
                  textAlign: 'center',
                }}
                fontSize="small"
              >
                {t('mySignatures.noMidjourney')}
              </Typography>
            </Grid>
          )}
        </Card>
      </CardActionArea>
      <Grid container>
        <Typography sx={{ color: 'white', m: 'auto', fontWeight: 800 }} fontSize="small">
          {need.nameTranslations.fa}
        </Typography>
      </Grid>
    </div>
  );
};

export default SignatureCard;

SignatureCard.propTypes = {
  need: PropTypes.object,
  signature: PropTypes.object,
};
