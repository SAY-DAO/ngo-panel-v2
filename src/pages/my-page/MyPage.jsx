import React, { useEffect, useState } from 'react';
import {
  Alert,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Snackbar,
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
import { UPDATE_NEED_CONFIRM_RESET } from '../../redux/constants/needConstant';
import { MY_PAGE_RESET } from '../../redux/constants/userConstants';
import { fetchDuplicateChildNeeds } from '../../redux/actions/needsAction';
import { fetchUserSignatures } from '../../redux/actions/blockchainAction';

function getModifiedNeeds(updatedTicket, addedTicket, need) {
  let theNeed;
  //  when ticket added
  if (!updatedTicket && need.id === addedTicket.need.flaskId) {
    theNeed = need;
    theNeed.tickets = [...theNeed.tickets, addedTicket];
    if (theNeed.tickets) {
      console.log(theNeed);
    }
    return theNeed;
  }

  //  when ticket color changed from TicketContent
  if (updatedTicket && need.id === parseInt(updatedTicket.needFlaskId, 10)) {
    theNeed = need;
    theNeed.tickets.map((t) => {
      // eslint-disable-next-line no-param-reassign
      t.color = parseInt(updatedTicket.color, 10);
      return t;
    });
    return theNeed;
  }
  return need;
}

const MyPage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [toastOpen, setToastOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [cardSelected, setCardSelected] = useState(0);
  const [swNewDetails, setSwNewDetails] = useState({});
  const [modifiedNeeds, setModifiedNeeds] = useState();
  const [openDialog, setDialogOpen] = useState(false);
  const [dialogValues, setDialogValues] = useState();
  const [count, setCount] = useState(0);
  const [skeleton, setSkeleton] = useState(true);
  const [selectedNeed, setSelectedNeed] = useState();
  const [totalNeedCount, setTotalNeedCount] = useState({
    notPaid: 0,
    paid: 0,
    purchased: 0,
    delivered: 0,
  });
  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails, loading: loadingPageDetails } = myPage;

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket, error: errorTicketAdd } = ticketAdd;

  const needConfirm = useSelector((state) => state.needConfirm);
  const { success: successConfirm, error: errorConfirm } = needConfirm;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket } = ticketUpdate;

  const myTickets = useSelector((state) => state.myTickets);
  const { tickets } = myTickets;

  const childNeedsDuplicates = useSelector((state) => state.childNeedsDuplicates);
  const { duplicates } = childNeedsDuplicates;

  const { signature } = useSelector((state) => state.signature);
  const { userSignatures } = useSelector((state) => state.signatures);

  useEffect(() => {
    if (swInfo) setSwNewDetails(swInfo && swInfo);
  }, [swInfo]);

  useEffect(() => {
    if (swInfo) dispatch(fetchUserSignatures());
  }, [swInfo, signature]);

  useEffect(() => {
    if (swNewDetails && swNewDetails.id) {
      dispatch(fetchMyPage(swNewDetails.id, swNewDetails.typeId, page, rowsPerPage));
    }
    return () => {
      dispatch({ type: MY_PAGE_RESET });
    };
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
      console.log('signature1');
      console.log(signature);
      if (signature) {
        let theNeed;
        organizedNeeds[3] = modifiedNeeds[3].map((need) => {
          theNeed = need;
          if (signature && theNeed.id === signature.flaskNeedId) {
            theNeed.signatures = [...theNeed.signatures, signature];
            console.log(signature);
          }
          return theNeed;
        });
      }
      setModifiedNeeds(organizedNeeds);
    }
  }, [addedTicket, pageDetails, updatedTicket, tickets, signature]);

  // set duplicates
  useEffect(() => {
    if (duplicates && selectedNeed) {
      setDialogValues({ duplicates, theNeed: selectedNeed });
      setDialogOpen(true);
    }
  }, [selectedNeed, duplicates]);

  // scroll
  useEffect(() => {
    if (loadingPageDetails) {
      window.scrollTo(0, 0);
    }
  }, [loadingPageDetails]);

  // toast
  useEffect(() => {
    if (errorTicketAdd || successConfirm || errorConfirm) {
      setToastOpen(true);
    }
  }, [errorTicketAdd, successConfirm, errorConfirm]);

  // close toast
  const handleCloseToast = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setModifiedNeeds([[], [], [], []]);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setModifiedNeeds([[], [], [], []]);
  };

  const handleDialog = (taskNeed) => {
    dispatch({ type: UPDATE_NEED_CONFIRM_RESET });
    dispatch(fetchDuplicateChildNeeds(taskNeed.child_id, taskNeed.id));
    setSelectedNeed(taskNeed);
  };

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      <CoverCard
        theUser={swNewDetails}
        needCount={pageDetails ? pageDetails.meta.realNotConfirmCount : -1}
        childCount={pageDetails && pageDetails.children}
        signatureCount={userSignatures && userSignatures.length}
        arrivals={pageDetails && pageDetails.arrivals}
        swInfo={swInfo}
        swNewDetails={swNewDetails}
        setSwNewDetails={setSwNewDetails}
        setSkeleton={setSkeleton}
        skeleton={skeleton}
      />

      {!modifiedNeeds ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <Grid container spacing={0}>
            <Card sx={{ width: '100%', overflowX: 'scroll', minHeight: '700px' }}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 1, mb: 1, minWidth: '950px' }}
              >
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {t('myPage.taskManager.title.notPaid')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {' '}
                    ({totalNeedCount.notPaid})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {t('myPage.taskManager.title.paid')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {' '}
                    ({totalNeedCount.paid})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {t('myPage.taskManager.title.purchased')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {' '}
                    ({totalNeedCount.purchased})
                  </Typography>
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {t('myPage.taskManager.title.delivered')}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: 11 }}>
                    {' '}
                    ({totalNeedCount.delivered})
                  </Typography>
                </Grid>
                <Grid sx={{ minWidth: '-webkit-fill-available' }}>
                  <Divider sx={{ pb: 2, mb: 2, minWidth: 'inherit' }} variant="fullWidth" />
                </Grid>
              </Grid>

              {loadingPageDetails ? (
                <Grid sx={{ textAlign: 'center' }}>
                  <CircularProgress />
                </Grid>
              ) : (
                <Grid
                  container
                  spacing={0}
                  sx={{ minWidth: '1000px', maxHeight: '1650px', overflowY: 'scroll' }}
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
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleCloseToast}>
          <Alert
            onClose={handleCloseToast}
            variant="filled"
            severity={errorTicketAdd ? 'error' : successConfirm && 'success'}
            sx={{ width: '100%' }}
          >
            {errorTicketAdd
              ? errorTicketAdd.data.message
              : errorConfirm && errorConfirm.data.message
              ? successConfirm
              : t('success.confirmed')}
          </Alert>
        </Snackbar>
      </Stack>
    </PageContainer>
  );
};

export default MyPage;
