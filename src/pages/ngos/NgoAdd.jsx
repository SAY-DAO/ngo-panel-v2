import React, { useEffect } from 'react';
import { Grid, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { fetchCountryList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';
import NgoAddForm from './NgoAddForm';

const BCrumb = [
  {
    to: '/ngo/list',
    title: 'NGOs List',
  },
  {
    title: 'Add',
  },
];

const NgoAdd = () => {
  const dispatch = useDispatch();

  const countryList = useSelector((state) => state.countryList);
  const { success: successCountryList } = countryList;

  // country
  useEffect(() => {
    if (!successCountryList) {
      dispatch({ type: COUNTRY_LIST_RESET });
      dispatch(fetchCountryList());
    }
  }, [successCountryList]);

  return (
    <PageContainer title="NGO Add" description="this is NGO Add page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      {!successCountryList ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <NgoAddForm />
      )}
    </PageContainer>
  );
};

export default NgoAdd;
