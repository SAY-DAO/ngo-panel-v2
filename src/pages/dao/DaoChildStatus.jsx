import React from 'react';
import { Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { ChildExistenceEnum } from '../../utils/types';

const DaoChildStatus = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

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

  const childList = []; // TODO: remove

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
        <Grid container spacing={1}>
          <Grid container direction="column">
            <Typography
              variant="h5"
              color="textSecondary"
              sx={{
                marginBottom: '0',
              }}
              gutterBottom
            >
              Children
            </Typography>
            <Typography
              variant="h2"
              sx={{
                mt: '1px',
                mb: '0px',
              }}
              gutterBottom
            >
              {!childList ? <CircularProgress /> : childList.children && childList.children.length}
            </Typography>
          </Grid>

          <Grid
            item
            lg={4}
            sm={4}
            xs={4}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography>
              <TagFacesIcon fontSize="medium" />
            </Typography>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                lineHeight: '1.2',
              }}
            >
              {!childList ? (
                <CircularProgress />
              ) : (
                childList.children && childList.children.filter((c) => c.isConfirmed).length
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              sx={{
                lineHeight: '1.2',
              }}
            >
              Confirmed
            </Typography>
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={4}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography>
              <MoodBadIcon fontSize="medium" />
            </Typography>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                lineHeight: '1.2',
              }}
            >
              {!childList ? (
                <CircularProgress />
              ) : (
                childList.children &&
                childList.children.filter((c) => c.existenceStatus === ChildExistenceEnum.DEAD)
                  .length
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              sx={{
                lineHeight: '1.2',
              }}
            >
              Dead
            </Typography>
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={4}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography>
              <TagFacesIcon fontSize="medium" />
            </Typography>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                lineHeight: '1.2',
              }}
            >
              {!childList ? (
                <CircularProgress />
              ) : (
                childList.children &&
                childList.children.filter(
                  (c) => c.existenceStatus === ChildExistenceEnum.ALIVE_PRESENT,
                ).length
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              sx={{
                lineHeight: '1.2',
              }}
            >
              Present
            </Typography>
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={4}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography>
              <SentimentVeryDissatisfiedIcon fontSize="medium" />
            </Typography>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                lineHeight: '1.2',
              }}
            >
              {!childList ? (
                <CircularProgress />
              ) : (
                childList.children &&
                childList.children.filter(
                  (c) => c.existenceStatus === ChildExistenceEnum.ALIVE_GONE,
                ).length
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              sx={{
                lineHeight: '1.2',
              }}
            >
              Gone
            </Typography>
          </Grid>
          <Grid
            item
            lg={4}
            sm={4}
            xs={4}
            sx={{
              textAlign: 'center',
            }}
          >
            <Typography>
              <SentimentDissatisfiedIcon fontSize="medium" />
            </Typography>
            <Typography
              variant="h4"
              fontWeight="600"
              sx={{
                lineHeight: '1.2',
              }}
            >
              {!childList ? (
                <CircularProgress />
              ) : (
                childList.children &&
                childList.children.filter((c) => c.existenceStatus === ChildExistenceEnum.TEMP_GONE)
                  .length
              )}
            </Typography>
            <Typography
              color="textSecondary"
              variant="h6"
              fontWeight="400"
              sx={{
                lineHeight: '1.2',
              }}
            >
              Temp Gone
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Chart options={optionsmonthlychart} series={seriesmonthlychart} type="area" height="90px" />
    </Card>
  );
};

export default DaoChildStatus;
