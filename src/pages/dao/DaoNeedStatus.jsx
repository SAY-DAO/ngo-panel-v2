import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import Chart from 'react-apexcharts';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { fetchNestNeeds } from '../../redux/actions/DaoAction';

const DaoNeedStatus = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const server = useSelector((state) => state.server);
  const { needList, loading: loadingServer } = server;

  const optionsmonthlychart = {
    grid: {
      show: true,
      borderColor: 'transparent',
      strokeDashArray: 2,
      padding: {
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
    colors: [primary],
    chart: {
      toolbar: {
        show: false,
      },
      foreColor: '#adb0bb',
      fontFamily: "'DM Sans',sans-serif",
      sparkline: {
        enabled: true,
      },
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
    stroke: {
      show: true,
      width: 2,
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
  };
  const seriesmonthlychart = [
    {
      name: 'This Need',
      data: [35, 60, 30, 55, 40],
    },
  ];
  return (
    <Card
      sx={{
        pb: 0,
        pl: 0,
        pr: 0,
      }}
    >
      <CardContent
        sx={{
          paddingLeft: '30px',
          paddingRight: '30px',
        }}
      >
        <Box display="flex" alignItems="flex-start">
          <Box>
            <Typography
              variant="h5"
              color="textSecondary"
              sx={{
                marginBottom: '0',
              }}
              gutterBottom
            >
              Nest Need Ratio
            </Typography>
            <Typography
              variant="body2"
              sx={{
                mt: '1px',
                mb: '0px',
              }}
              gutterBottom
            >
              {/*  meta.totalItemsfrom pagination */}
              {!needList ? <CircularProgress /> : needList.totalDone} {''}/ {''}
              {!needList ? <CircularProgress /> : needList.needs && needList.needs.meta.totalItems}
              {''} ~ {''}
              {!needList ? (
                <CircularProgress />
              ) : (
                <Typography
                  component="span"
                  variant="h2"
                  sx={{
                    marginBottom: '0',
                  }}
                  gutterBottom
                >
                  {needList.needs &&
                    (needList.totalDone / needList.needs.meta.totalItems).toFixed(2)}
                </Typography>
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              marginLeft: 'auto',
            }}
          >
            <LoadingButton
              loading={loadingServer}
              aria-label="children=refresh"
              color="secondary"
              onClick={() => dispatch(fetchNestNeeds())}
            >
              <RefreshIcon />
            </LoadingButton>
          </Box>
        </Box>
      </CardContent>
      <Chart options={optionsmonthlychart} series={seriesmonthlychart} type="area" height="90px" />
    </Card>
  );
};

export default DaoNeedStatus;
