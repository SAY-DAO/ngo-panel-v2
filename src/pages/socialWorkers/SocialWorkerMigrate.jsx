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
  fetchSwOrNgoChildList,
} from '../../redux/actions/socialWorkerAction';
import {
  MIGRATE_ONE_CHILD_RESET,
  MIGRATE_SW_CHILDREN_RESET,
  SW_LIST_RESET,
} from '../../redux/constants/socialWorkerConstants';
import Message from '../../components/Message';
import SocialWorkerCard from '../../components/socialworker/SocialWorkerCard';
import MigrateDialog from '../../components/dialogs/MigrateDialog';

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
  // to save result after state change
  const [fromSw, setFromSw] = useState();
  const [toSw, setToSw] = useState();
  const [isDisabled, setIsDisabled] = useState(true);

  const [dialogValues, setDialogValues] = useState();
  const [openMigrate, setOpenMigrate] = useState(false);

  const swAll = useSelector((state) => state.swAll);
  const { swList, loading: loadingSwAll, success: successSwAll } = swAll;

  const swMigrate = useSelector((state) => state.swMigrate);
  const { error: errorMigrate, success: successMigrate } = swMigrate;

  const swOneMigrate = useSelector((state) => state.swOneMigrate);
  const { error: errorOneMigrate, success: successOneMigrate } = swOneMigrate;

  const swById = useSelector((state) => state.swById);
  const { result, children, loading: loadingSw } = swById;

  useEffect(() => {
    if ((openTo || openFrom) && !successSwAll) {
      dispatch(fetchSocialWorkersList());
    }
    if (swList) {
      const filterActive = swList && swList.filter((sw) => sw.isActive === true);
      setOptions([...filterActive]);
    }
    if (!openFrom && !openTo) {
      dispatch({ type: SW_LIST_RESET });
    }
    if (successMigrate) {
      dispatch({ type: MIGRATE_SW_CHILDREN_RESET });
    }
  }, [openFrom, openTo, swList]);

  // when migrate one child
  useEffect(() => {
    if (errorOneMigrate || successOneMigrate) {
      dispatch({ type: MIGRATE_ONE_CHILD_RESET });
    }
  }, [openFrom, openTo, swList]);

  // from sw card
  useEffect(() => {
    if (result && children && from) {
      setFromSw({ result, children });
    }
    if (toSw) {
      setToSw();
    }
  }, [from, result, children]);

  // to sw card
  useEffect(() => {
    if (result && children && to) {
      setToSw({ result, children });
    }
  }, [to, result, children]);

  useEffect(() => {
    if (successMigrate) {
      setFromSw();
      setToSw();
    }
  }, [successMigrate]);

  useEffect(() => {
    if (fromSw && toSw) {
      console.log(fromSw);
      console.log(toSw);
      if (fromSw.children.totalCount > 0 && toSw.result.id !== fromSw.result.id) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
    }
  }, [fromSw, toSw, to, from]);

  const handleChangeFrom = (e) => {
    if (e.target.outerText) {
      setTo();
      const swId = e.target.outerText.split(/([0-9]+)/)[1];
      dispatch(fetchSocialWorkerById(swId));
      dispatch(fetchSwOrNgoChildList(swId));
      setFrom(swId);
    }
  };

  const handleChangeTo = (e) => {
    if (e.target.outerText) {
      setFrom();
      const swId = e.target.outerText.split(/([0-9]+)/)[1];
      dispatch(fetchSocialWorkerById(swId));
      dispatch(fetchSwOrNgoChildList(swId));
      setTo(swId);
    }
  };

  const handleMigrateDialog = () => {
    setOpenMigrate(true);
    setDialogValues({
      fromSw,
      toSw,
    });
  };
  return (
    <PageContainer title="Social Worker Edit" description="this is Social Worker Edit page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <Grid container spacing={1} direction="row" alignItems="center">
          <Grid item lg={5} xs={12}>
            <Autocomplete
              id="from"
              sx={{ maxWidth: 400 }}
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
                  ? `${option.id}`
                  : `${option.id} - ${option.firstName} ${option.lastName} - ${option.ngoName}`;
              }}
              options={options}
              loading={loadingSwAll}
              onChange={handleChangeFrom}
              renderInput={(params) => {
                return (
                  <TextField
                    {...params}
                    label={t('socialWorker.migrate.from')}
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
          <Grid item lg={5} xs={12}>
            <Autocomplete
              id="to"
              sx={{ maxWidth: 400 }}
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
                  label={t('socialWorker.migrate.to')}
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
          <Grid item sx={{ m: 'auto' }} xs>
            <LoadingButton
              loading={loadingSw}
              disabled={isDisabled}
              onClick={handleMigrateDialog}
              variant="contained"
            >
              {t('socialWorker.button.migrate')} <ChildCareIcon sx={{ m: 1 }} fontSize="small" />
            </LoadingButton>
          </Grid>
          <Grid item sx={{ m: 'auto', mt: 10 }}>
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
      {!loadingSw ? (
        <SocialWorkerCard fromSw={fromSw} toSw={toSw} />
      ) : (
        <Grid container>
          <CircularProgress sx={{ m: 'auto' }} />
        </Grid>
      )}
      <MigrateDialog open={openMigrate} setOpen={setOpenMigrate} dialogValues={dialogValues} />
    </PageContainer>
  );
}
