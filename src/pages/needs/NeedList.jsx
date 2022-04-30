/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import { fetchSocialWorkerProfile, fetchSwNeedList } from '../../redux/actions/socialWorkerAction';
import { fetchChildList } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import NeedTable from './NeedTable';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';

const NeedList = () => {
  const dispatch = useDispatch();

  const [ngoId, setNgoId] = useState();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const loading = open && options.length === 0;

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo.length === 0;

  const childAll = useSelector((state) => state.childAll);
  const { childList, success: successChildren } = childAll;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const swNeedList = useSelector((state) => state.swNeedList);
  const { needs, success: successNeedList } = swNeedList;

  const swDetails = useSelector((state) => state.swDetails);
  const { loading: loadingSwDetails, success: successSwDetails } = swDetails;

  useEffect(() => {
    if (!successSwDetails) {
      dispatch(fetchSocialWorkerProfile());
    }
  }, [successSwDetails]);

  // needs
  // useEffect(() => {
  //   if (ngoId) {
  //     dispatch(fetchSwNeedList({ ngoId }));
  //   }
  // }, [ngoId]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }
    (async () => {
      dispatch(fetchNgoList());

      if (active && successNgoList) {
        setOptionsNgo([...ngoList]);
      }
    })();
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList]);

  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    }
  }, [openNgo]);

  // Autocomplete children
  useEffect(() => {
    let active = true;
    if (!loading) {
      return undefined;
    }
    (async () => {
      if (ngoId) {
        dispatch(fetchChildList({ ngoId }));
      }

      if (active && successChildren) {
        setOptions([...childList.children]);
      }
    })();
    return () => {
      active = false;
    };
  }, [loading, successChildren, ngoId]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const BCrumb = [
    {
      to: '/need/list',
      title: 'Needs List',
    },
    {
      title: 'Add',
    },
  ];

  return (
    <>
      {loadingSwDetails ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        <PageContainer title="Login">
          <Breadcrumb items={BCrumb} />
          <Grid container spacing={2}>
            <Grid item>
              <Autocomplete
                id="asynchronous-ngo"
                sx={{ width: 300 }}
                open={openNgo}
                onOpen={() => {
                  setOpenNgo(true);
                }}
                onClose={() => {
                  setOpenNgo(false);
                }}
                onChange={(e, value) => value && setNgoId(value.id) && console.log(value.id)}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => `${option.id} - ${option.name}`}
                options={optionsNgo}
                loading={loadingNgo}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ngo"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingNgo ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item>
              {successNgoList && ngoId && (
                <Autocomplete
                  id="asynchronous-children"
                  sx={{ width: 300 }}
                  open={open}
                  onOpen={() => {
                    setOpen(true);
                  }}
                  onClose={() => {
                    setOpen(false);
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={(option) => `${option.id} - ${option.sayName}`}
                  options={options}
                  loading={loading}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Children"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              )}
            </Grid>
            <Grid item>
              <FormControl component="fieldset">
                <FormControlLabel
                  value="end"
                  control={<Switch color="primary" />}
                  label="End"
                  labelPlacement="bottom"
                />
              </FormControl>
            </Grid>
            {successNeedList && <NeedTable childrenList={needs || needs.needs} />}
          </Grid>
        </PageContainer>
      )}
    </>
  );
};

export default NeedList;
