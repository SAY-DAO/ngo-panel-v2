/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { fetchFamilyAnalytic } from '../../../redux/actions/analyticAction';
import { VirtualFamilyRole } from '../../../utils/types';
import { median } from '../../../utils/helpers';

const medianList = [];

function generateDayWiseTimeSeries(data, vRole) {
  const series = [];
  const userPays = [];
  if (data) {
    data.map((n) => {
      // we might have two payments for a need, we get the father one
      const usersInThisRole = n.participants.filter((u) => u.flaskFamilyRole === vRole);
      usersInThisRole.forEach((partic) => {
        // get the payment of the participant
        const payment = n.payments.find((p) => p.id_user === partic.id_user);

        if (payment && payment.id_user) {
          userPays.push({
            userId: payment.id_user,
            created: payment.created,
          });
        }
      });

      return n.id;
    });
  }
  const listOfIds = [];
  userPays.map((u) => {
    const filtered = userPays.filter((p) => p.userId === u.userId);
    if (!listOfIds.find((item) => item.userId === u.userId)) {
      listOfIds.push({ userId: u.userId });
      series.push({ userId: u.userId, total: filtered.length });
    }
    return u;
  });

  // {userId: 126, total: 101}
  const sorted = series.sort((a, b) => a.total - b.total);

  // const listOfIds2 = [];
  const final = sorted.map((s) => {
    return [s.total, sorted.filter((o) => o.total === s.total).length];
  });
  // [[1,162],[4, 5], ...]
  medianList.push({ [vRole]: final.map((el) => el[0]) });
  console.log(median(medianList.map((el) => el[0])[0]));
  console.log(medianList.map((el) => el[1])[1] && median(medianList.map((el) => el[1])[1]));
  console.log((medianList.map((el) => el[2])[2]) && median(medianList.map((el) => el[2])[2]));
  console.log((medianList.map((el) => el[3])[3]) && median(medianList.map((el) => el[3])[3]));
  console.log((medianList.map((el) => el[4])[4]) && median(medianList.map((el) => el[4])[4]));
  console.log((medianList.map((el) => el[5])[5]) && median(medianList.map((el) => el[5])[5]));
  return final;
}

export default function AnalyticFamily2() {
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
            data: generateDayWiseTimeSeries(roles.daeiData, VirtualFamilyRole.DAEI),
          },
          {
            name: 'Amme',
            data: generateDayWiseTimeSeries(roles.ammeData, VirtualFamilyRole.AMME),
          },
        ],
        chart: {
          // height: 750,
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
              // show: true,
            },
          },
          yaxis: {
            lines: {
              // show: true,
            },
          },
        },
        xaxis: {
          max: 5,
          // type: 'datetime',
        },
        yaxis: {
        },
      });
    }
  }, [roles]);

  useEffect(() => {
    if (!roles) {
      dispatch(fetchFamilyAnalytic());
    }
  }, []);

  return (
    <div id="chart">
      <Typography sx={{ mt: 5, textAlign: 'center' }}>
        Sum of Delivered per Role (e.g: 2 Amo had delivered 29 needs each)
      </Typography>
      {options && (
        <ReactApexChart options={options} series={options.series} type="scatter" height={350} />
      )}
    </div>
  );
}
