import React, { useState, useEffect } from 'react';
import {
  Card,
  Grid,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PageContainer from '../../components/container/PageContainer';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import { AddSw } from '../../redux/actions/socialWorkerAction';
import Message from '../../components/Message';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { fetchNgoList } from '../../redux/actions/ngoAction';

const DaoMileStoneForm = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [theDate, setBirthDate] = useState(new Date());

  const swAdd = useSelector((state) => state.swAdd);
  const { success: successAddUpdate, error: errorAddUpdate } = swAdd;

  const ngoAll = useSelector((state) => state.ngoAll);
  const { success: successNgoList, loading: loadingNgoAll } = ngoAll;

  useEffect(() => {
    if (!successNgoList) {
      dispatch(fetchNgoList());
    }
  }, []);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Please enter your first name'),
    lastName: Yup.string().required('Please enter your last name'),
    ngoId: Yup.string().required('Please enter your NGO'),
    typeId: Yup.string().required('Please enter permission'),
    idNumber: Yup.string().required('Please enter your ID number'),
    phoneNumber: Yup.string().required('Please enter your phone number'),
    emergencyPhoneNumber: Yup.string().required('Please enter your emergency phone'),
    email: Yup.string().required('Please enter your email'),
    telegramId: Yup.string().required('Please enter your telegram handle'),
    acceptTerms: Yup.bool(),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);
    dispatch(
      AddSw({
        theDate,
        title: data.title,
        description: data.description,
      }),
    );
  };

  const handleDateChange = (newValue) => {
    setBirthDate(newValue);
  };

  return (
    <PageContainer title="MileStone Add" description="this is MileStone Add page">
      {loadingNgoAll ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      ) : (
        successNgoList && (
          <>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Card sx={{ p: 3 }}>
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <CustomFormLabel htmlFor="time">{t('dao.milestone.time')}</CustomFormLabel>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DesktopDatePicker
                        id="theDate"
                        inputFormat="MM/dd/yyyy"
                        value={theDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} />}
                        helperText={errors && errors.theDate && errors.theDate.message}
                      />
                    </LocalizationProvider>
                    <CustomFormLabel htmlFor="Title">{t('dao.milestone.title')}</CustomFormLabel>
                    <TextField
                      id="title"
                      variant="outlined"
                      fullWidth
                      sx={{ mb: 1 }}
                      control={control}
                      {...register('title')}
                      error={!!errors.title}
                      helperText={errors && errors.title && errors.title.message}
                    />
                    <CustomFormLabel htmlFor="description">
                      {t('dao.milestone.description')}
                    </CustomFormLabel>
                    <CustomTextField
                      id="description"
                      variant="outlined"
                      multiline
                      rows={4}
                      sx={{ mb: 2 }}
                      fullWidth
                      control={control}
                      register={{ ...register('description') }}
                      helperText={errors && errors.description && errors.description.message}
                    />
                  </form>
                </Card>
              </Grid>
            </Grid>

            <Grid>
              {(successAddUpdate || errorAddUpdate) && (
                <Message
                  severity={successAddUpdate ? 'success' : 'error'}
                  variant="filled"
                  input="addSw"
                  backError={errorAddUpdate}
                  sx={{ width: '100%' }}
                >
                  {successAddUpdate && t('socialWorker.updated')}
                </Message>
              )}
            </Grid>
          </>
        )
      )}
    </PageContainer>
  );
};

export default DaoMileStoneForm;
