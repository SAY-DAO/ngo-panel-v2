import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import { fetchProviderList } from '../../redux/actions/providerAction';
import ProviderTable from '../../components/tables/ProviderTable';
import { fetchCityList, fetchCountryList, fetchStateList } from '../../redux/actions/countryAction';
import { COUNTRY_LIST_RESET } from '../../redux/constants/countryConstants';

const ProviderList = () => {
  const dispatch = useDispatch();

  const providerAll = useSelector((state) => state.providerAll);
  const { providerList, loading, success } = providerAll;

  const providerDelete = useSelector((state) => state.providerDelete);
  const { success: successDelete } = providerDelete;

  const countryList = useSelector((state) => state.countryList);
  const { countries, states, success: successCountryList } = countryList;

  useEffect(() => {
    dispatch(fetchProviderList());
  }, [dispatch, successDelete]);

  // country
  useEffect(() => {
    if (!successCountryList) {
      dispatch({ type: COUNTRY_LIST_RESET });
      dispatch(fetchCountryList());
    }
  }, [successCountryList]);

  // state
  useEffect(() => {
    if (countries) {
      dispatch(fetchStateList(1));
    }
  }, [countries]);

  // city
  useEffect(() => {
    if (countries) {
      dispatch(fetchCityList(1));
    }
  }, [countries, states]);

  return (
    <>
      {loading ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        success && (
          <PageContainer>
            <Grid>
              <ProviderTable providerList={providerList} />
            </Grid>
          </PageContainer>
        )
      )}
    </>
  );
};

export default ProviderList;
