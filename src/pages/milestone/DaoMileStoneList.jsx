import React, { useEffect } from 'react';
import { Box, Card } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import DaoMileStoneTimeLine from '../../components/DaoMileStoneTimeLine';
import { getMileStones } from '../../redux/actions/milestoneAction';

const BCrumb = [
  {
    to: '/Dao',
    title: 'DAO',
  },
  {
    title: 'Milestone',
  },
];

const DaoMileStoneList = () => {
  const dispatch = useDispatch();

  const mileStone = useSelector((state) => state.mileStone);
  const { fetched } = mileStone;

  useEffect(() => {
    dispatch(getMileStones());
  }, []);

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        {fetched &&
          fetched.map(() => (
            <Box sx={{ width: '100%' }}>
              <DaoMileStoneTimeLine />
            </Box>
          ))}
      </Card>
    </PageContainer>
  );
};

export default DaoMileStoneList;
