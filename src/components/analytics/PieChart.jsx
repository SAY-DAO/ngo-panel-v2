import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Grid, Typography, IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import PageContainer from '../container/PageContainer';
import { PaymentStatusEnum } from '../../utils/helpers';

const PieChart = ({ allNeeds, donaNeeds, totalNeeds, maxCount, take, setTake }) => {
  const { t } = useTranslation();

  let unpayableCount = 0;
  for (let i = 0; i < allNeeds.length; i += 1) {
    if (allNeeds[i].unpayable && allNeeds[i].status <= PaymentStatusEnum.COMPLETE_PAY) {
      unpayableCount += 1;
    }
  }

  let confirmedCount = 0;
  for (let i = 0; i < allNeeds.length; i += 1) {
    if (!allNeeds[i].isConfirmed) {
      confirmedCount += 1;
    }
  }

  const optionspiechart = {
    chart: {
      id: 'pie-chart',
      fontFamily: "'DM Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        },
      },
    },
    legend: {
      show: true,
      position: 'bottom',
      width: '80px',
    },
    labels: [t('need.pie.ok'), t('need.pie.unpayable'), t('need.pie.unconfirmed')],
    colors: ['rgb(0, 194, 146)', 'rgb(237, 77 ,96)', 'rgb(254, 201, 15)'],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  const seriespiechart = [
    totalNeeds - unpayableCount - confirmedCount,
    unpayableCount,
    confirmedCount,
  ];

  const handleClick = () => {
    setTake(take + 100);
  };
  return (
    <PageContainer title="Pie Charts" description="this is innerpage">
      <Card>
        <Card
          sx={{
            textAlign: 'center',
            p: 1,
            m: 0,
          }}
        >
          <CardContent>
            <Grid container direction="row" alignItems="center" justifyContent="center">
              <Grid item xs={12} md={3}>
                <Typography
                  variant="h1"
                  fontWeight="500"
                  sx={{
                    marginBottom: '0',
                    marginTop: '0px',
                  }}
                  gutterBottom
                >
                  {maxCount}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="400"
                  sx={{
                    marginBottom: '0',
                    opacity: '0.6',
                  }}
                  gutterBottom
                >
                  {t('need.totalCount')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Tooltip title={t('need.loadMore')}>
                  <IconButton
                    aria-haspopup="true"
                    onClick={handleClick}
                    size="large"
                    aria-label="action"
                  >
                    <RotateLeftIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography
                  variant="h4"
                  fontWeight="400"
                  sx={{
                    marginBottom: '0',
                    opacity: '0.8',
                  }}
                  gutterBottom
                >
                  {t('need.display')}
                </Typography>
                <Typography
                  variant="h1"
                  fontWeight="500"
                  sx={{
                    marginBottom: '0',
                    marginTop: '0px',
                  }}
                  gutterBottom
                >
                  {donaNeeds.length} {' / '}
                  {totalNeeds}
                </Typography>
                <Typography
                  variant="h6"
                  fontWeight="400"
                  sx={{
                    marginBottom: '0',
                    opacity: '0.6',
                  }}
                  gutterBottom
                >
                  {t('need.statsRatio')}
                </Typography>

              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Card
          sx={{
            textAlign: 'center',
            p: 1,
            m: 0,
          }}
        >
          <CardContent>
            <Chart options={optionspiechart} series={seriespiechart} type="pie" height="270px" />
          </CardContent>
        </Card>
      </Card >
    </PageContainer >
  );
};

export default PieChart;

PieChart.propTypes = {
  donaNeeds: PropTypes.array.isRequired,
  totalNeeds: PropTypes.number.isRequired,
  maxCount: PropTypes.number,
  allNeeds: PropTypes.array.isRequired,
  take: PropTypes.number.isRequired,
  setTake: PropTypes.func.isRequired,
};
