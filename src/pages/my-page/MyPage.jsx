import React, { useEffect, useState } from 'react';
import {
  Card,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  TablePagination,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/my-profile/CoverCard';
import TaskCard from '../../components/my-profile/TaskCard';
import { fetchMyPage } from '../../redux/actions/userAction';
import { connectWallet } from '../../redux/actions/blockchainAction';

const MyPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, loading: loadingProfile } = myPage;

  const [swNewDetails, setSwNewDetails] = useState({});

  useEffect(() => {
    if (swInfo) setSwNewDetails(swInfo && swInfo);
  }, [swInfo]);

  // Metamask
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log(accounts);
        dispatch(connectWallet());
      });
    }
  }, [window.ethereum]);

  useEffect(() => {
    if (swNewDetails && swNewDetails.id) {
      const isUser = swInfo.id === swNewDetails.id ? 1 : 0; // when 0 displays all children when 1 shows children/needs  created by them
      dispatch(fetchMyPage(swNewDetails, isUser));
    }
  }, [swNewDetails]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <>
        <CoverCard
          theUser={swNewDetails}
          childCount={pageDetails ? pageDetails.childrenCount : 0}
          needCount={pageDetails ? pageDetails.needsCount : 0}
          signatureCount={pageDetails ? pageDetails.signaturesCount : 0}
          swInfo={swInfo}
          swNewDetails={swNewDetails}
          setSwNewDetails={setSwNewDetails}
        />
        <Grid container spacing={0}>
          <Card sx={{ width: '100%', overflowX: 'scroll', minHeight: '500px' }}>
            <Grid
              container
              justifyContent="space-around"
              alignItems="center"
              sx={{ mt: 1, mb: 1, minWidth: '950px' }}
            >
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.notPaid')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ({pageDetails.needs.notPaid.length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.paid')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ( {pageDetails.needs.paid.length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.purchased')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ( {pageDetails.needs.purchased.length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.done')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ( {pageDetails.needs.childDelivered.length})
                  </Typography>
                )}
              </Grid>
              <Grid sx={{ minWidth: '-webkit-fill-available' }}>
                <Divider sx={{ pb: 2, mb: 2, minWidth: 'inherit' }} variant="fullWidth" />
              </Grid>
            </Grid>

            {loadingProfile ? (
              <Grid sx={{ textAlign: 'center' }}>
                <CircularProgress />
              </Grid>
            ) : (
              <Grid
                container
                spacing={0}
                sx={{ minWidth: '1000px', maxHeight: '650px', overflowY: 'scroll' }}
              >
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs.notPaid
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs.paid
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs.purchased
                      .concat(pageDetails.needs.moneyToNgo)
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs.childDelivered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
              </Grid>
            )}
          </Card>
          <Stack spacing={2}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              labelRowsPerPage={t('table.rowCount')}
              component="div"
              count={
                pageDetails
                  ? Math.max(
                      pageDetails.needs.notPaid.length,
                      pageDetails.needs.paid.length,
                      pageDetails.needs.purchased.length,
                      pageDetails.needs.childDelivered.length,
                    )
                  : 2
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Stack>
        </Grid>
      </>
    </PageContainer>
  );
};

export default MyPage;
