import React, { useEffect } from 'react';
import { Typography, Box, Grid, Stack, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../../base-card/DashboardCard';
import { fetchChildrenEcosystemAnalytics } from '../../../redux/actions/analyticAction';

const AnalyticChildrenNeeds = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { blue } = theme.palette.charts;
  const { purple } = theme.palette.charts;
  const { yellow } = theme.palette.charts;
  const { cyan } = theme.palette.charts;
  const { darkRed } = theme.palette.charts;
  const { green } = theme.palette.charts;

  const ecosystemAnalytics = useSelector((state) => state.ecosystemAnalytics);
  const { ecosystemChildrenResult } = ecosystemAnalytics;

  useEffect(() => {
    if (!ecosystemChildrenResult) {
      dispatch(fetchChildrenEcosystemAnalytics());
    }
  }, []);

  const options = ecosystemChildrenResult && {
    chart: {
      type: 'bar',
      height: 600,
      stacked: true,
      toolbar: {
        show: false,
      },
      foreColor: '#adb0bb',
      fontFamily: 'DM sans',
      sparkline: {
        enabled: false,
      },
    },
    grid: {
      show: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 1,
      },
    },
    colors: [yellow, blue, cyan, darkRed, purple, green],
    fill: {
      type: 'solid',
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    legend: {
      show: false,
    },

    // {
    //   name: 'ConfirmedNotPaid',
    //   data:
    //     ecosystemChildrenResult &&
    //     ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.confirmedNotPaidCount),
    // },
    // {
    //   name: 'UnConfirmed',
    //   data:
    //     ecosystemChildrenResult &&
    //     ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.unConfirmedCount),
    // },


    xaxis: {
      type: 'category',
      categories: ecosystemChildrenResult.childrenList.map(
        (c) => `${c.child.sayname_translations.en} - ${c.child.id_ngo}`,
      ),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },

      labels: {
        style: {
          colors: 'white',
          fontSize: '12px',
          fontFamily: 'Helvetica, Arial, sans-serif',
          fontWeight: 400,
          cssClass: 'apexcharts-xaxis-label',
        },
      },
    },
    yaxis: {
      show: true,
      // min: ecosystemChildrenResult && Math.min(...ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.allCount)),
      // max:
      //   ecosystemChildrenResult &&
      //   Math.max(...ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.allCount)) + 10,
      // tickAmount: 20,
    },

    tooltip: {
      theme: 'dark',
    },
  };

  const series = [
    {
      name: 'ConfirmedNotPaid',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.confirmedNotPaidCount),
    },
    {
      name: 'UnConfirmed',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.unConfirmedCount),
    },

    {
      name: 'PartialPay',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.partialPayCount),
    },
    {
      name: 'MoneyToNgo',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.moneyToNgoCount),
    },
    {
      name: 'Purchased',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.purchasedCount),
    },
    {
      name: 'DeliveredChild / 10',
      data:
        ecosystemChildrenResult &&
        ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.deliveredChildCount / 10),
    },

    // {
    //   name: 'DeliveredNgo',
    //   data: ecosystemChildrenResult && ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.deliveredNgoCount),
    // },
    // {
    //   name: 'All',
    //   data: ecosystemChildrenResult && ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.allCount),
    // },
    // {
    //   name: 'CompletePay',
    //   data: ecosystemChildrenResult && ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.completePayCount),
    // },
    // {
    //   name: 'Confirmed',
    //   data: ecosystemChildrenResult && ecosystemChildrenResult.childrenList.map((c) => c.childNeedsStats.confirmedCount),
    // },
  ];

  return (
    <DashboardCard
      title="Ecosystem Analysis"
      subtitle="Latest new products"
      customdisplay="block"
      action={
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: green,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => green,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Delivered /10
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: purple,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => purple,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Purchased
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: darkRed,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => darkRed,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Money to NGO
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: cyan,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => cyan,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Partial Pay
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: blue,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => blue,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Unconfirmed
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: yellow,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => yellow,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Confirmed not Paid
          </Typography>
        </Stack>
      }
    >
      <Grid
        container
        spacing={0}
        sx={{
          mt: 3,
        }}
      >
        <Grid item xs={12}>
          <Box>
            {!ecosystemChildrenResult ? (
              <CircularProgress />
            ) : (
              <Chart
                options={options}
                series={series}
                type="bar"
                height="265"
                style={{ direction: 'ltr' }}
              />
            )}
          </Box>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Typography>
              Complete Pay:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanCompletePayPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Not Paid:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanConfirmedNotPaidPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Confirmed: {ecosystemChildrenResult && ecosystemChildrenResult.meanConfirmedPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Delivered Child:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanDeliveredChildPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Delivered Ngo:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanDeliveredNgoPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Family Members: {ecosystemChildrenResult && ecosystemChildrenResult.meanFamilyMembers}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Money to NGO:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanMoneyToNgoPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Needs Per Child {ecosystemChildrenResult && ecosystemChildrenResult.meanNeedsPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Partial Pays:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanPartialPayPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Purchased: {ecosystemChildrenResult && ecosystemChildrenResult.meanPurchasedPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              UnConfirmed:
              {ecosystemChildrenResult && ecosystemChildrenResult.meanUnConfirmedPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Total Families: {ecosystemChildrenResult && ecosystemChildrenResult.totalFamilies}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              TotalFamily Member:
              {ecosystemChildrenResult && ecosystemChildrenResult.totalFamilyMembers}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AnalyticChildrenNeeds;
