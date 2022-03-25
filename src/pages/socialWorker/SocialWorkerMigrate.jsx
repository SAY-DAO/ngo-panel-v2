import { Autocomplete, Card, CircularProgress, Grid, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import {
  fetchSocialWorkerById,
  fetchSocialWorkersList,
  migrateSwChildren,
} from '../../redux/actions/socialWorkerAction';
import { SW_LIST_RESET } from '../../redux/constants/socialWorkerConstants';
import Message from '../../components/Message';

const BCrumb = [
  {
    to: '/sw/list',
    title: 'Social Workers List',
  },
  {
    title: 'Migrate',
  },
];

export default function SocialWorkerMigrate() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [options, setOptions] = useState([]);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading: loadingSwAll, success: successSwAll } = swAll;

  const swMigrate = useSelector((state) => state.swMigrate);
  const { error: errorMigrate, success: successMigrate } = swMigrate;

  useEffect(() => {
    if ((openTo || openFrom) && !successSwAll) {
      dispatch(fetchSocialWorkersList());
    }
    if (swList) {
      setOptions([...swList]);
    }
    if (!openFrom && !openTo) {
      dispatch({ type: SW_LIST_RESET });
    }
  }, [openFrom, openTo, swList]);

  const handleChangeFrom = (e) => {
    if (e.target.outerText) {
      const swId = e.target.outerText.split(/([0-9]+)/)[1];
      console.log(swId);
      dispatch(fetchSocialWorkerById(swId));
      setFrom(swId);
      console.log('swId');
      console.log(swId);
    }
  };

  const handleChangeTo = (e) => {
    if (e.target.outerText) {
      const swId = e.target.outerText.split(/([0-9]+)/)[1];
      dispatch(fetchSocialWorkerById(swId));
      setTo(swId);
      console.log(swId);
    }
  };

  const handleMigrate = () => {
    dispatch(migrateSwChildren(from, to));
  };

  return (
    <PageContainer title="Social Worker Edit" description="this is Social Worker Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <Grid container>
          <Grid item xs={6}>
            <Autocomplete
              id="from"
              sx={{ width: 400 }}
              open={openFrom}
              onOpen={() => {
                setOpenFrom(true);
              }}
              onClose={() => {
                setOpenFrom(false);
              }}
              isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
              getOptionLabel={(option) => {
                return !option.firstName
                  ? 'no name'
                  : `${option.id} - ${option.firstName} ${option.lastName} - ${option.ngoName}`;
              }}
              options={options}
              loading={loadingSwAll}
              onChange={handleChangeFrom}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label="From"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingSwAll ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                );
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Autocomplete
              id="to"
              sx={{ width: 400 }}
              open={openTo}
              onOpen={() => {
                setOpenTo(true);
              }}
              onClose={() => {
                setOpenTo(false);
              }}
              includeInputInList
              isOptionEqualToValue={(option, value) => option.firstName === value.firstName}
              getOptionLabel={(option) => {
                return !option.firstName
                  ? 'no name'
                  : `${option.id} - ${option.firstName} ${option.lastName} - ${option.ngoName}`;
              }}
              options={options}
              loading={loadingSwAll}
              onChange={handleChangeTo}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="To"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingSwAll ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 3 }}
        >
          <Grid item>
            <LoadingButton onClick={handleMigrate} variant="contained">
              {t('socialWorker.button.migrate')}
              <ChildCareIcon fontSize="small" />
            </LoadingButton>
          </Grid>
          <Grid item>
            {(successMigrate || errorMigrate) && (
              <Message
                severity={successMigrate ? 'success' : 'error'}
                variant="filled"
                input="addSw"
                backError={errorMigrate}
                sx={{ width: '100%' }}
              >
                {successMigrate && t('socialWorker.migrated')}
              </Message>
            )}
          </Grid>
        </Grid>
      </Card>
    </PageContainer>
  );
}
