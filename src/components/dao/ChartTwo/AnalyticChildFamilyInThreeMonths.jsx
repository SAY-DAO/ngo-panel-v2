import React, { useEffect } from 'react';
import { Typography, Box, Grid, Stack, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Chart from 'react-apexcharts';
import FeatherIcon from 'feather-icons-react';
import { useDispatch, useSelector } from 'react-redux';
import DashboardCard from '../../base-card/DashboardCard';
import { fetchChildFamilyAnalytic } from '../../../redux/actions/analyticAction';

const AnalyticChildFamilyInThreeMonths = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const { green } = theme.palette.charts;

  const ecosystemAnalytics = useSelector((state) => state.ecosystemAnalytics);
  const { ecosystemChildFamilyResult } = ecosystemAnalytics;

  useEffect(() => {
    if (!ecosystemChildFamilyResult) {
      dispatch(fetchChildFamilyAnalytic());
    }
  }, [ecosystemChildFamilyResult]);

  const options = ecosystemChildFamilyResult &&
    ecosystemChildFamilyResult && {
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
      colors: [green],
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
        categories: ecosystemChildFamilyResult.actives.map((c) => c.childSayName),
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
      },

      tooltip: {
        theme: 'dark',
      },
    };

  const series = ecosystemChildFamilyResult &&
    ecosystemChildFamilyResult && [
      {
        name: 'Active',
        data: ecosystemChildFamilyResult.actives.map((c) => c.family.activeUsersInThreeMonths),
      },
    ];

  return (
    <DashboardCard
      title="Children Family Activity - Three Months"
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
            Active
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
            {!ecosystemChildFamilyResult ? (
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
      </Grid>
    </DashboardCard>
  );
};

export default AnalyticChildFamilyInThreeMonths;
