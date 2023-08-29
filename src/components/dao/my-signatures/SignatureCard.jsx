import React from 'react';
import { Avatar, Box, Card, Grid, IconButton, Typography } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import ReplayIcon from '@mui/icons-material/Replay';
import { useAccount, useNetwork } from 'wagmi';
import { prepareUrl } from '../../../utils/helpers';
import { verifySignature } from '../../../redux/actions/blockchainAction';

const SignatureCard = ({ signatureHash, need }) => {
  const dispatch = useDispatch();

  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const handleVerifySignature = () => {
    dispatch(
      verifySignature(
        {
          chainId: chain?.id,
          flaskNeedId: need.flaskId,
          signerAddress: address,
          statuses: need.statusUpdates,
          receipts: need.receipts,
          payments: need.verifiedPayments,
        },
        signatureHash,
      ),
    );
  };
  return (
    <>
      <Card
        elevation={3}
        sx={{
          p: 0,
          borderRadius: 8,
          height: 200,
          background: need.midjourneyImage
            ? `url(${`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.midjourneyImage}`})`
            : `url(${need.needRetailerImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          position: 'relative',
        }}
      >
        {isConnected && (
          <IconButton onClick={handleVerifySignature}>
            <ReplayIcon />
          </IconButton>
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
      </Card>
      <Grid container>
        <Typography sx={{ color: 'white', m: 'auto', fontWeight: 800 }} fontSize="small">
          {need.nameTranslations.fa}
        </Typography>
      </Grid>
    </>
  );
};

export default SignatureCard;

SignatureCard.propTypes = {
  need: PropTypes.object,
  signatureHash: PropTypes.string,
};
