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
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
} from '../../utils/types';
import ConfirmNeedDialog from '../../components/dialogs/ConfirmNeedDialog';
import { getDuplicateChildNeeds } from '../../utils/helpers';
import { UPDATE_NEED_CONFIRM_RESET } from '../../redux/constants/needConstant';

function getModifiedNeeds(updatedTicket, addedTicket, need) {
  let theNeed;
  //  when ticket added
  if (!updatedTicket && need.id === addedTicket.need.flaskId) {
    theNeed = need;
    theNeed.ticket = addedTicket;
    return theNeed;
  }

  //  when ticket color changed from TicketContent
  if (updatedTicket && need.id === parseInt(updatedTicket.needFlaskId, 10)) {
    theNeed = need;
    theNeed.ticket.color = parseInt(updatedTicket.color, 10);
    return theNeed;
  }
  return need;
}

const MyPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cardSelected, setCardSelected] = useState(0);
  const [swNewDetails, setSwNewDetails] = useState({});
  const [modifiedNeeds, setModifiedNeeds] = useState();
  const [openDialog, setDialogOpen] = useState(false);
  const [dialogValues, setDialogValues] = useState();
  const [count, setCount] = useState(0);
  const [totalNeedCount, setTotalNeedCount] = useState({
    notPaid: 0,
    paid: 0,
    purchased: 0,
    delivered: 0,
  });
  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, loading: loadingProfile } = myPage;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket } = ticketAdd;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket } = ticketUpdate;

  const myTickets = useSelector((state) => state.myTickets);
  const { tickets } = myTickets;

  useEffect(() => {
    if (swInfo) setSwNewDetails(swInfo && swInfo);
  }, [swInfo]);

  useEffect(() => {
    if (swNewDetails && swNewDetails.id) {
      dispatch(fetchMyPage(swNewDetails.id, swNewDetails.typeId, page, rowsPerPage));
    }
  }, [swNewDetails, page, rowsPerPage]);

  useEffect(() => {
    if (pageDetails) {
      setCount(pageDetails.max);
      setTotalNeedCount({
        notPaid: pageDetails.meta.notPaid,
        paid: pageDetails.meta.paid,
        purchased: pageDetails.meta.purchased,
        delivered: pageDetails.meta.delivered,
      });
    }
  }, [pageDetails]);

  useEffect(() => {
    if (pageDetails) {
      setTotalNeedCount({
        notPaid: 0,
        paid: 0,
        purchased: 0,
        delivered: 0,
      });
    }
  }, []);

  // [[not paid], [payment], [purchased/delivered Ngo/Ngo Payment], [Done]]
  useEffect(() => {
    if (pageDetails && pageDetails.needs) {
      const organizedNeeds = pageDetails.needs;

      // -------------------------PAYMENT-----------------------------
      // 0 index / not Paid
      if (
        (updatedTicket && updatedTicket.needStatus === PaymentStatusEnum.NOT_PAID) ||
        (addedTicket && addedTicket.need.status === PaymentStatusEnum.NOT_PAID)
      ) {
        organizedNeeds[0] = modifiedNeeds[0].map((need) => {
          return getModifiedNeeds(updatedTicket, addedTicket, need);
        });
        // 1 index /  Payment Received
      } else if (
        (updatedTicket &&
          (updatedTicket.needStatus === PaymentStatusEnum.PARTIAL_PAY ||
            updatedTicket.needStatus === PaymentStatusEnum.COMPLETE_PAY)) ||
        (addedTicket &&
          (addedTicket.need.status === PaymentStatusEnum.PARTIAL_PAY ||
            addedTicket.need.status === PaymentStatusEnum.COMPLETE_PAY))
      ) {
        organizedNeeds[1] = modifiedNeeds[1].map((need) => {
          return getModifiedNeeds(updatedTicket, addedTicket, need);
        });
      }
      // -------------------------SERVICE-----------------------------
      if (
        (updatedTicket && updatedTicket.needType === NeedTypeEnum.SERVICE) ||
        (addedTicket && addedTicket.need.type === NeedTypeEnum.SERVICE)
      ) {
        // 2 index /  Payment sent to NGO
        if (
          (updatedTicket && updatedTicket.needStatus === ServiceStatusEnum.MONEY_TO_NGO) ||
          (addedTicket && addedTicket.need.status === ServiceStatusEnum.MONEY_TO_NGO)
        ) {
          organizedNeeds[2] = modifiedNeeds[2].map((need) => {
            return getModifiedNeeds(updatedTicket, addedTicket, need);
          });
        }
        // 3 index /  Delivered to child
        if (
          (updatedTicket && updatedTicket.needStatus === ServiceStatusEnum.DELIVERED) ||
          (addedTicket && addedTicket.need.status === ServiceStatusEnum.DELIVERED)
        ) {
          organizedNeeds[3] = modifiedNeeds[3].map((need) => {
            return getModifiedNeeds(updatedTicket, addedTicket, need);
          });
        }
        // -------------------------PRODUCT----------------------------
      } else if (
        (updatedTicket && updatedTicket.needType === NeedTypeEnum.PRODUCT) ||
        (addedTicket && addedTicket.need.type === NeedTypeEnum.PRODUCT)
      ) {
        // 2 index / Purchased
        if (
          (updatedTicket && updatedTicket.needStatus === ProductStatusEnum.PURCHASED_PRODUCT) ||
          (addedTicket && addedTicket.need.status === ProductStatusEnum.PURCHASED_PRODUCT)
        ) {
          organizedNeeds[2] = modifiedNeeds[2].map((need) => {
            return getModifiedNeeds(updatedTicket, addedTicket, need);
          });
        }
        // 2 index / Delivered to Ngo
        if (
          (updatedTicket && updatedTicket.needStatus === ProductStatusEnum.DELIVERED_TO_NGO) ||
          (addedTicket && addedTicket.need.status === ProductStatusEnum.DELIVERED_TO_NGO)
        ) {
          organizedNeeds[2] = modifiedNeeds[2].map((need) => {
            return getModifiedNeeds(updatedTicket, addedTicket, need);
          });
        }
        // 3 index / Delivered to child
        if (
          (updatedTicket && updatedTicket.needStatus === ProductStatusEnum.DELIVERED) ||
          (addedTicket && addedTicket.need.status === ProductStatusEnum.DELIVERED)
        ) {
          organizedNeeds[3] = modifiedNeeds[3].map((need) => {
            return getModifiedNeeds(updatedTicket, addedTicket, need);
          });
        }
      }
      setModifiedNeeds(organizedNeeds);
    }
  }, [addedTicket, pageDetails, updatedTicket, tickets]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialog = (taskNeed) => {
    dispatch({ type: UPDATE_NEED_CONFIRM_RESET });
    const duplicates = getDuplicateChildNeeds(modifiedNeeds[0], taskNeed);
    setDialogValues({ duplicates, theNeed: taskNeed });
    setDialogOpen(true);
  };

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <CoverCard
        theUser={swNewDetails}
        needCount={pageDetails ? pageDetails.meta.realNotConfirmCount : -1}
        childCount={pageDetails && pageDetails.children}
        signatureCount={pageDetails ? pageDetails.signatures.length : -1}
        arrivals={pageDetails && pageDetails.arrivals.arrivals}
        swInfo={swInfo}
        swNewDetails={swNewDetails}
        setSwNewDetails={setSwNewDetails}
      />
      {!modifiedNeeds ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container spacing={0}>
            <Card sx={{ width: '100%', overflowX: 'scroll', minHeight: '500px' }}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 1, mb: 1, minWidth: '950px' }}
              >
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">{t('myPage.taskManager.title.notPaid')}</Typography>
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ({totalNeedCount.notPaid})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">{t('myPage.taskManager.title.paid')}</Typography>
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ({totalNeedCount.paid})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">
                    {t('myPage.taskManager.title.purchased')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ({totalNeedCount.purchased})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">
                    {t('myPage.taskManager.title.delivered')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 12 }}>
                    ({totalNeedCount.delivered})
                  </Typography>
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
                    {modifiedNeeds &&
                      modifiedNeeds[0].map((need) => (
                        <TaskCard
                          key={need.id}
                          need={need}
                          setCardSelected={setCardSelected}
                          cardSelected={cardSelected}
                          swNewDetails={swNewDetails}
                          handleDialog={handleDialog}
                        />
                      ))}
                  </Grid>
                  <Grid item xs={3}>
                    {modifiedNeeds[1].map((need) => (
                      <TaskCard
                        key={need.id}
                        need={need}
                        setCardSelected={setCardSelected}
                        cardSelected={cardSelected}
                        swNewDetails={swNewDetails}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={3}>
                    {modifiedNeeds[2].map((need) => (
                      <TaskCard
                        key={need.id}
                        need={need}
                        setCardSelected={setCardSelected}
                        cardSelected={cardSelected}
                        swNewDetails={swNewDetails}
                      />
                    ))}
                  </Grid>
                  <Grid item xs={3}>
                    {modifiedNeeds[3].map((need) => (
                      <TaskCard
                        key={need.id}
                        need={need}
                        setCardSelected={setCardSelected}
                        cardSelected={cardSelected}
                        swNewDetails={swNewDetails}
                      />
                    ))}
                  </Grid>
                </Grid>
              )}
            </Card>
            <Stack spacing={2}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                labelRowsPerPage={t('table.rowCount')}
                component="div"
                count={count}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Stack>
          </Grid>
          {dialogValues && (
            <ConfirmNeedDialog
              open={openDialog}
              setOpen={setDialogOpen}
              dialogValues={dialogValues}
            />
          )}
        </>
      )}
    </PageContainer>
  );
};

export default MyPage;
