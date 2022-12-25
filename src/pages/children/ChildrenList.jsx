import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';

import { fetchChildList } from '../../redux/actions/childrenAction';
import { fetchNgoList } from '../../redux/actions/ngoAction';
import ChildrenTable from './ChildrenTable';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Children Table',
  },
];

const ChildrenList = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [openNgo, setOpenNgo] = useState(false);
  const [optionsNgo, setOptionsNgo] = useState([]);
  const loadingNgo = openNgo && optionsNgo.length === 0;

  const [ngoId, setNgoId] = useState();

  const ngoAll = useSelector((state) => state.ngoAll);
  const { ngoList, success: successNgoList } = ngoAll;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren, loading: loadingChildList, success: successChildren } = childAll;
  console.log(myChildren, successChildren, ngoId, ngoList);

  // children
  useEffect(() => {
    if (ngoId) {
      dispatch(fetchChildList({ ngoId }));
    }
  }, [ngoId]);

  // Autocomplete ngo
  useEffect(() => {
    let active = true;
    if (!loadingNgo) {
      return undefined;
    }
    if (active && successNgoList) {
      setOptionsNgo([...ngoList]);
    }
    return () => {
      active = false;
    };
  }, [loadingNgo, successNgoList]);

  // ngo open
  useEffect(() => {
    if (!openNgo) {
      setOptionsNgo([]);
    } else {
      dispatch(fetchNgoList());
    }
  }, [openNgo]);

  return (
    <PageContainer title="Children" description="this is Children page">
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Grid container flexDirection="column" flexWrap="nowrap" spacing={2}>
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
            onChange={(e, value) => setNgoId(value && value.id)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option) => `${option.id} - ${option.name}`}
            options={optionsNgo}
            loading={loadingNgo}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t('common.ngoName')}
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
          {loadingChildList ? (
            <CircularProgress />
          ) : (
            successChildren && ngoId && <ChildrenTable childList={myChildren.children} />
          )}
        </Grid>
      </Grid>
    </PageContainer>
  );
};;

export default ChildrenList;
