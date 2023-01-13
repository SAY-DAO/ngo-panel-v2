import React, { useEffect, useState } from 'react';
import { Card, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/my-profile/CoverCard';
import TaskCard from '../../components/my-profile/TaskCard';
import { fetchMyPage } from '../../redux/actions/userAction';
import { RolesEnum } from '../../utils/helpers';

const MyPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [take, setTake] = useState(100);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, loading: loadingProfile } = myPage;

  const [swNewDetails, setSwNewDetails] = useState({});

  useEffect(() => {
    if (swInfo) setSwNewDetails(swInfo && swInfo);
  }, [swInfo]);

  useEffect(() => {
    let createdBy;
    let confirmedBy;
    let purchasedBy;
    if (swNewDetails && swNewDetails.typeId) {
      if (
        swNewDetails.typeId === RolesEnum.ADMIN ||
        swNewDetails.typeId === RolesEnum.SUPER_ADMIN
      ) {
        createdBy = 0;
        confirmedBy = swNewDetails.id;
        purchasedBy = 0;
      } else if (swNewDetails.typeId === RolesEnum.COORDINATOR) {
        createdBy = 0;
        confirmedBy = 0;
        purchasedBy = swNewDetails.id;
      } else if (
        swNewDetails.typeId === RolesEnum.SOCIAL_WORKER ||
        swNewDetails.typeId === RolesEnum.NGO_SUPERVISOR
      ) {
        createdBy = swNewDetails.id;
        confirmedBy = 0;
        purchasedBy = 0;
      }
      dispatch(fetchMyPage({ take, createdBy, confirmedBy, purchasedBy }));
    }
    return () => {
      // dispatch({ type: MY_PAGE_RESET });
    };
  }, [swNewDetails, take]);

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <>
        <CoverCard
          theUser={swNewDetails}
          childCount={pageDetails ? pageDetails.childrenCount : 0}
          needCount={pageDetails ? pageDetails.needsCount : 0}
          signatureCount={pageDetails ? pageDetails.signaturesCount : 0}
          take={take}
          setTake={setTake}
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
                    {' '}({pageDetails.needs[0].length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.paid')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    {'  '}( {pageDetails.needs[1].length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.purchased')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    {'  '}( {pageDetails.needs[2].length})
                  </Typography>
                )}
              </Grid>
              <Grid item>
                <Typography component="span">{t('myPage.taskManager.title.done')}</Typography>
                {pageDetails && (
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    {'  '}( {pageDetails.needs[3].length})
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
                    pageDetails.needs[0] &&
                    pageDetails &&
                    pageDetails.needs[0].map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs[1] &&
                    pageDetails &&
                    pageDetails.needs[1].map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs[2] &&
                    pageDetails &&
                    pageDetails.needs[2].map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
                <Grid item xs={3}>
                  {pageDetails &&
                    pageDetails.needs[3] &&
                    pageDetails &&
                    pageDetails.needs[3].map((need) => <TaskCard key={need.id} need={need} />)}
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>
      </>
    </PageContainer>
  );
};

export default MyPage;
