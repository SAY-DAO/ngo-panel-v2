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
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  ServiceStatusEnum,
} from '../../utils/types';

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
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [cardSelected, setCardSelected] = useState(0);
  const [swNewDetails, setSwNewDetails] = useState({});
  const [modifiedNeeds, setModifiedNeeds] = useState();

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
      dispatch(fetchMyPage(swNewDetails, isUser, 0, 15));
    }
  }, [swNewDetails]);

  useEffect(() => {
    if (pageDetails && pageDetails.needs) {
      const organizedNeeds = pageDetails.needs; // [[not paid], [payment], [purchased/delivered Ngo/Ngo Payment], [Done]]
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

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      {!modifiedNeeds ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <>
          <CoverCard
            theUser={swNewDetails}
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
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 1, mb: 1, minWidth: '950px' }}
              >
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">{t('myPage.taskManager.title.notPaid')}</Typography>
                  {modifiedNeeds && (
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      ( {modifiedNeeds[0].length})
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">{t('myPage.taskManager.title.paid')}</Typography>
                  {modifiedNeeds && (
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      ( {modifiedNeeds[1].length})
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">
                    {t('myPage.taskManager.title.purchased')}
                  </Typography>
                  {modifiedNeeds && (
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      ( {modifiedNeeds[2].length})
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={3} sx={{ textAlign: 'center' }}>
                  <Typography component="span">{t('myPage.taskManager.title.done')}</Typography>
                  {modifiedNeeds && (
                    <Typography component="span" sx={{ fontSize: 12 }}>
                      ( {modifiedNeeds[3].length})
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
                      modifiedNeeds[0]
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((need) => (
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
                    {pageDetails &&
                      modifiedNeeds[1]
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((need) => (
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
                    {pageDetails &&
                      modifiedNeeds[2]
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((need) => (
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
                    {pageDetails &&
                      modifiedNeeds[3]
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((need) => (
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
                count={
                  pageDetails
                    ? Math.max(
                        modifiedNeeds[0].length,
                        modifiedNeeds[1].length,
                        modifiedNeeds[2].length,
                        modifiedNeeds[3].length,
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
      )}
    </PageContainer>
  );
};

export default MyPage;
