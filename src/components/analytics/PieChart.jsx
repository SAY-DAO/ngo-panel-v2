import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import PageContainer from '../container/PageContainer';

const PieChart = ({ allNeeds, donaNeeds, totalNeeds }) => {
  let unpayableCount = 0;
  for (let i = 0; i < allNeeds.length; i += 1) {
    if (allNeeds[i].unpayable) {
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
    labels: ['OK', 'Unpayable', 'Not Confirmed'],
    colors: ['rgb(0, 194, 146)', 'rgb(254, 201, 15)', 'rgb(237, 77 ,96)'],
    tooltip: {
      fillSeriesColor: false,
    },
  };
  const seriespiechart = [
    totalNeeds - unpayableCount - confirmedCount,
    unpayableCount,
    confirmedCount,
  ];

  return (
    <PageContainer title="Pie Charts" description="this is innerpage">
      <Card>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Card
            sx={{
              color: 'white',
              textAlign: 'center',
              p: 1,
              m: 0,
            }}
          >
            <CardContent>
              <Typography
                variant="h4"
                fontWeight="400"
                sx={{
                  marginBottom: '0',
                  opacity: '0.8',
                }}
                gutterBottom
              >
                Needs
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
                Done / Total
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <CardContent>
          <Chart options={optionspiechart} series={seriespiechart} type="pie" height="270px" />
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default PieChart;

PieChart.propTypes = {
  donaNeeds: PropTypes.array.isRequired,
  totalNeeds: PropTypes.number.isRequired,
  allNeeds: PropTypes.array.isRequired,
};
