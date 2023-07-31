/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Typography } from '@mui/material';
import { fetchFamilyAnalytic } from '../../../redux/actions/analyticAction';
import { VirtualFamilyRole } from '../../../utils/types';

function sortByDate(items) {
  return items.sort((first, second) => {
    if (moment(first.child_delivery_date).isSame(second.child_delivery_date)) {
      return -1; // If they have the same date, return the first item
    }
    if (moment(first.child_delivery_date).isBefore(second.child_delivery_date)) {
      return -1; // If the first date is earlier, return the first item
    }
    return 1; // The second date is earlier, so it goes first;
  });
}
function generateDayWiseTimeSeries(data, vRole) {
  const series = [];
  let y = 0;
  if (data) {
    const sorted = sortByDate(data);
    sorted.forEach((n) => {
      y++;
      // we might have two payments for a need, we get the father one
      const usersInThisRole = n.participants.filter((u) => u.flaskFamilyRole === vRole);
      usersInThisRole.forEach((partic) => {
        // get the payment of the participant
        const payment = n.payments.find((p) => p.id_user === partic.id_user);

        if (payment) {
          const x = n.child_delivery_date;
          series.push({ date: new Date(x).getTime(), counter: y });
        }
      });
    });
  }
  const final = series.map((d) => [d.date, d.counter]);
  return final;
}

export default function AnalyticFamily() {
  const dispatch = useDispatch();
  const [options, setOptions] = useState();

  const familyAnalyitics = useSelector((state) => state.familyAnalyitics);
  const { roles } = familyAnalyitics;

  useEffect(() => {
    if (roles) {
      setOptions({
        series: [
          {
            name: 'Father',
            data: generateDayWiseTimeSeries(roles.fatherData, VirtualFamilyRole.FATHER),
          },
          {
            name: 'Mother',
            data: generateDayWiseTimeSeries(roles.motherData, VirtualFamilyRole.MOTHER),
          },
          {
            name: 'Amoo',
            data: generateDayWiseTimeSeries(roles.amooData, VirtualFamilyRole.AMOO),
          },
          {
            name: 'Khaleh',
            data: generateDayWiseTimeSeries(roles.khalehData, VirtualFamilyRole.KHALEH),
          },
          {
            name: 'Daie',
            data: generateDayWiseTimeSeries(roles.daieData, VirtualFamilyRole.DAEI),
          },
          {
            name: 'Amme',
            data: generateDayWiseTimeSeries(roles.ammeData, VirtualFamilyRole.AMME),
          },
        ],
        chart: {
        //   height: 750,
          type: 'scatter',
          zoom: {
            type: 'xy',
          },
        },
        dataLabels: {
          //   enabled: true,
        },
        grid: {
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
        },
        xaxis: {
          type: 'datetime',
          //   max: 7000,
        },
        yaxis: {},
      });
    }
  }, [roles]);

  useEffect(() => {
    dispatch(fetchFamilyAnalytic());
  }, []);

  return (
    <div id="chart">
      <Typography sx={{ mt: 5, textAlign: 'center' }}>
        Counting Delivered per Role every day
      </Typography>
      {options && (
        <ReactApexChart options={options} series={options.series} type="scatter" height={350} />
      )}
    </div>
  );
}
