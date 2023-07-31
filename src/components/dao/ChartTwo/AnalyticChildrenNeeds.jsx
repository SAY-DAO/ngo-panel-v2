import React, { useEffect, useState } from 'react';
import { Typography, Box, Grid, Stack, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../../base-card/DashboardCard';
import { fetchEcosystemAnalytics } from '../../../redux/actions/analyticAction';

const AnalyticChildrenNeeds = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [localResults, setLocalResults] = useState(JSON.parse(localStorage.getItem('ecosystem')));

  const { blue } = theme.palette.charts;
  const { purple } = theme.palette.charts;
  const { red } = theme.palette.charts;
  const { yellow } = theme.palette.charts;
  const { green } = theme.palette.charts;
  const { darkRed } = theme.palette.charts;

  const ecosystemAnalytics = useSelector((state) => state.ecosystemAnalytics);
  const { ecosystemResult } = ecosystemAnalytics;

  useEffect(() => {
    console.log(
      localResults && Math.max(...localResults.childrenList.map((c) => c.childNeedsStats.all)),
    );

    if (!localResults) {
      dispatch(fetchEcosystemAnalytics());
    }
  }, []);

  useEffect(() => {
    if (ecosystemResult) {
      setLocalResults(localStorage.setItem('ecosystem', JSON.stringify(ecosystemResult)));
    }
  }, [ecosystemResult]);

  const options = {
    chart: {
      type: 'bar',
      height: 400,
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
        columnWidth: '75%',
        borderRadius: 2,
      },
    },
    colors: [darkRed, yellow, green, red, purple, blue, blue, blue, purple, red],
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
    xaxis: {
      type: 'category',
      categories:
        localResults && localResults.childrenList.map((c) => c.child.sayname_translations.en),
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
      min: localResults && Math.min(...localResults.childrenList.map((c) => c.childNeedsStats.all)),
      max:
        localResults &&
        Math.max(...localResults.childrenList.map((c) => c.childNeedsStats.all)) + 10,
      tickAmount: 4,
    },

    tooltip: {
      theme: 'dark',
    },
  };

  const series = [
    // {
    //   name: 'All',
    //   data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.all),
    // },
    {
      name: 'CompletePay',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.completePay),
    },
    // {
    //   name: 'Confirmed',
    //   data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.confirmed),
    // },
    {
      name: 'ConfirmedNotPaid',
      data:
        localResults && localResults.childrenList.map((c) => c.childNeedsStats.confirmedNotPaid),
    },
    {
      name: 'DeliveredChild',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.deliveredChild),
    },
    {
      name: 'DeliveredNgo',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.deliveredNgo),
    },
    {
      name: 'MoneyToNgo',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.moneyToNgo),
    },
    {
      name: 'PartialPay',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.partialPay),
    },
    {
      name: 'Purchased',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.purchased),
    },
    {
      name: 'UnConfirmed',
      data: localResults && localResults.childrenList.map((c) => c.childNeedsStats.unConfirmed),
    },
  ];

  return (
    <DashboardCard
      title="Products Performance"
      subtitle="Latest new products"
      customdisplay="block"
      action={
        <Stack direction="row" spacing={2}>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: () => theme.palette.secondary.main,
            }}
          >
            <Typography
              sx={{
                color: 'secondary.main',
                '& svg': {
                  fill: () => theme.palette.secondary.main,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            All
          </Typography>
          <Typography
            variant="h6"
            display="flex"
            alignItems="center"
            sx={{
              color: () => theme.palette.warning.main,
            }}
          >
            <Typography
              sx={{
                color: 'warning.main',
                '& svg': {
                  fill: () => theme.palette.warning.main,
                },
                mr: '5px',
              }}
            >
              <FeatherIcon icon="circle" width="10" height="10" />
            </Typography>
            Complete Pay
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
            {!localResults ? (
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
              Complete Pay: {localResults && localResults.meanCompletePayPerChild}
            </Typography>
          </Grid>

          <Grid item xs={2}>
            <Typography>
              Not Paid: {localResults && localResults.meanConfirmedNotPaidPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Confirmed: {localResults && localResults.meanConfirmedPerChild}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Delivered Child: {localResults && localResults.meanDeliveredChildPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Delivered Ngo: {localResults && localResults.meanDeliveredNgoPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Family Members: {localResults && localResults.meanFamilyMembers}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Money to NGO: {localResults && localResults.meanMoneyToNgoPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Needs Per Child {localResults && localResults.meanNeedsPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              Partial Pays: {localResults && localResults.meanPartialPayPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Purchased: {localResults && localResults.meanPurchasedPerChild}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              UnConfirmed: {localResults && localResults.meanUnConfirmedPerChild}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>Total Families: {localResults && localResults.totalFamilies}</Typography>
          </Grid>
          <Grid item xs={2}>
            <Typography>
              TotalFamily Member: {localResults && localResults.totalFamilyMembers}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default AnalyticChildrenNeeds;
