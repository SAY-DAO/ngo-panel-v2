import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import {
  Autocomplete,
  Box,
  Card,
  FormHelperText,
  Grid,
  InputAdornment,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { NeedTypeEnum, ProductStatusEnum, ServiceStatusEnum } from '../../utils/types';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import { updateNeedStatus } from '../../redux/actions/needsAction';
import TodayCard from '../TodayCard';

export default function StatusDialog({ need, statusDialog, setStatusDialog, setStatusNeed }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [openStatus, setOpenStatus] = useState(false);
  const [optionsStatus, setOptionsStatus] = useState([]);
  const [currentStatus, setCurrentStatus] = useState();
  const [statusId, setStatusId] = useState();
  const [productExpDelivery, setExpProductDelivery] = useState(new Date());
  const [productDelivered, setProductDelivered] = useState(new Date());

  const needStatusUpdate = useSelector((state) => state.needStatusUpdate);
  const { success: SuccessStatusUpdate, loading: loadingAStatusUpdate } = needStatusUpdate;

  const validationSchema = Yup.object().shape({
    expProductToNgo:
      need.type === NeedTypeEnum.PRODUCT &&
      statusId === ProductStatusEnum.PURCHASED_PRODUCT &&
      Yup.string().required(t('error.report.expectedDeliveryToNgo')),
    retailerCode:
      need.type === NeedTypeEnum.PRODUCT &&
      statusId === ProductStatusEnum.PURCHASED_PRODUCT &&
      Yup.string().required(t('error.report.retailerCode')),
    retailerPaid:
      need.type === NeedTypeEnum.PRODUCT &&
      statusId === ProductStatusEnum.PURCHASED_PRODUCT &&
      Yup.string().required(t('error.report.retailerPaid')),
    // productDeliveredToNgo:
    //   need.type === NeedTypeEnum.PRODUCT &&
    //   statusId === ProductStatusEnum.DELIVERED_TO_NGO &&
    //   Yup.date().required(t('error.report.deliveredToNgo')),
    bankTrackId:
      need.type === NeedTypeEnum.SERVICE &&
      statusId === ServiceStatusEnum.MONEY_TO_NGO &&
      Yup.string().required(t('error.report.bankTrackId')),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (need) {
      setValue('paid', need.cost);
      // setValue('purchasedCost', need.cost);
      // setProductDelivered(new Date(need.expected_delivery_date));
    }
  }, [need]);

  useEffect(() => {
    if (SuccessStatusUpdate) {
      setStatusId();
      reset();
    }
  }, [SuccessStatusUpdate]);

  // Autocomplete status
  useEffect(() => {
    if (need.type === NeedTypeEnum.SERVICE) {
      if (need.status === ServiceStatusEnum.COMPLETE_PAY) {
        setCurrentStatus(t('need.needDialogue.service.2'));
      } else if (need.status === ServiceStatusEnum.MONEY_TO_NGO) {
        setCurrentStatus(t('need.needDialogue.service.3'));
      } else if (need.status === ServiceStatusEnum.DELIVERED) {
        setCurrentStatus(t('need.needDialogue.service.4'));
      }
      if (need.status === ServiceStatusEnum.COMPLETE_PAY) {
        setOptionsStatus([
          { title: t('need.needDialogue.service.3'), id: ServiceStatusEnum.MONEY_TO_NGO },
        ]);
      } else if (need.status === ServiceStatusEnum.MONEY_TO_NGO) {
        setOptionsStatus([
          { title: t('need.needDialogue.service.4'), id: ServiceStatusEnum.DELIVERED },
        ]);
      } else if (need.status === ServiceStatusEnum.DELIVERED) {
        setOptionsStatus([
          { title: t('need.needDialogue.service.4'), id: ServiceStatusEnum.DELIVERED },
        ]);
      }
    } else if (need.type === NeedTypeEnum.PRODUCT) {
      if (need.status === ProductStatusEnum.COMPLETE_PAY) {
        setCurrentStatus(t('need.needDialogue.product.2'));
      } else if (need.status === ProductStatusEnum.PURCHASED_PRODUCT) {
        setCurrentStatus(t('need.needDialogue.product.3'));
      } else if (need.status === ProductStatusEnum.DELIVERED_TO_NGO) {
        setCurrentStatus(t('need.needDialogue.product.4'));
      } else if (need.status === ProductStatusEnum.DELIVERED) {
        setCurrentStatus(t('need.needDialogue.product.4'));
      }
      if (need.status === ProductStatusEnum.COMPLETE_PAY) {
        setOptionsStatus([
          { title: t('need.needDialogue.product.3'), id: ProductStatusEnum.PURCHASED_PRODUCT },
        ]);
      } else if (need.status === ProductStatusEnum.PURCHASED_PRODUCT) {
        // allow to update purchased products
        setOptionsStatus([
          { title: t('need.needDialogue.product.3'), id: ProductStatusEnum.PURCHASED_PRODUCT },
          { title: t('need.needDialogue.product.4'), id: ProductStatusEnum.DELIVERED_TO_NGO },
        ]);
      } else if (need.status === ProductStatusEnum.DELIVERED_TO_NGO) {
        // allow to update purchased products
        setOptionsStatus([
          { title: t('need.needDialogue.product.5'), id: ProductStatusEnum.DELIVERED },
        ]);
      } else if (need.status === ProductStatusEnum.DELIVERED) {
        // allow to update purchased products
        setOptionsStatus([
          { title: t('need.needDialogue.product.5'), id: ProductStatusEnum.DELIVERED },
        ]);
      }
    }
  }, [need, statusId, currentStatus]);

  const handleClose = () => {
    setStatusDialog(false);
    setStatusNeed();
  };

  const handleExpDeliveryChange = (newValue) => {
    setExpProductDelivery(new Date(newValue));
  };

  const handleDeliveredChange = (newValue) => {
    setProductDelivered(new Date(newValue));
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const values = {};
    values.needId = need.flaskId || need.id;
    if (need.type === NeedTypeEnum.SERVICE) {
      values.typeId = NeedTypeEnum.SERVICE;
      if (statusId === ServiceStatusEnum.MONEY_TO_NGO) {
        values.bank_track_id = data.bankTrackId.toString();
        values.statusId = statusId;
      }
      if (statusId === ServiceStatusEnum.DELIVERED) {
        values.purchase_cost = Number(data.purchasedCost);
        values.statusId = statusId;
      }
    }
    if (need.type === NeedTypeEnum.PRODUCT) {
      values.typeId = NeedTypeEnum.PRODUCT;
      if (statusId === ProductStatusEnum.PURCHASED_PRODUCT) {
        values.expected_delivery_date = format(new Date(productExpDelivery), 'yyyy-MM-dd');
        values.purchase_cost = Number(data.retailerPaid);
        values.dkc = data.retailerCode.toString();
        values.statusId = statusId;
      }
      if (statusId === ProductStatusEnum.DELIVERED_TO_NGO) {
        values.ngo_delivery_date = format(new Date(productDelivered), 'yyyy-MM-dd');
        values.statusId = statusId;
      }
      if (statusId === ProductStatusEnum.DELIVERED) {
        values.statusId = statusId;
      }
    }

    dispatch(updateNeedStatus(values));
  };

  return (
    <div>
      {currentStatus && (
        <Dialog open={statusDialog} onClose={handleClose}>
          <DialogTitle sx={{ p: 2, textAlign: 'center', fontSize: '1.2rem' }}>
            {t('need.needStatusTitle')}
          </DialogTitle>
          <DialogContent sx={{ p: 0 }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Grid item>
                <TodayCard />
              </Grid>
              <Grid item>
                <Card elevation={8}>
                  <DialogContentText
                    sx={{
                      textAlign: 'center',
                      maxWidth: '600px',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '250px',
                      whiteSpace: 'nowrap',
                      pb: 2,
                      margin: 'auto',
                    }}
                  >
                    {need.title}
                    <br />
                    <strong>{need.name}</strong>
                  </DialogContentText>
                </Card>
              </Grid>
            </Grid>
            <Card sx={{ p: 1 }}>
              <Grid
                container
                direction="row"
                spacing={2}
                sx={{ p: 2, width: window.innerWidth > 600 ? '500px' : '250px' }}
                justifyContent="center"
              >
                <Grid item lg={6} md={12} xs={12}>
                  <TextField
                    disabled
                    label={t('socialWorker.migrate.from')}
                    id="outlined-disabled"
                    defaultValue={`${need.status} - ${currentStatus}`}
                  />
                </Grid>
                <Grid item lg={6} md={12} xs={12}>
                  {optionsStatus && (
                    <Autocomplete
                      id="asynchronous"
                      open={openStatus}
                      onOpen={() => {
                        setOpenStatus(true);
                      }}
                      onClose={() => {
                        setOpenStatus(false);
                      }}
                      options={optionsStatus}
                      onChange={(e, value) => setStatusId(value && value.id)}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      getOptionLabel={(option) => `${option.id} - ${option.title} `}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                          key={option.id}
                          {...props}
                        >
                          <Typography>{`${option.id} - ${option.title} `}</Typography>
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label={t('need.newStatus')} />
                      )}
                    />
                  )}
                </Grid>
              </Grid>
              <Grid item lg={8} md={12} xs={12}>
                {need.type === NeedTypeEnum.PRODUCT && (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {statusId === ProductStatusEnum.PURCHASED_PRODUCT && (
                      <Grid container spacing={2}>
                        <Grid item lg={6} md={6} xs={12}>
                          <CustomFormLabel htmlFor="exp-product-delivery-to-ngo">
                            {t('report.statusChange.expectedDeliveryToNgo')}
                          </CustomFormLabel>
                          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                            <DateTimePicker
                              id="expProductToNgo"
                              value={new Date(productExpDelivery)}
                              control={control}
                              {...register('expProductToNgo', { required: true })}
                              onChange={handleExpDeliveryChange}
                              renderInput={(params) => <TextField {...params} />}
                              error={!!errors.expProductToNgo}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item lg={6} md={6} xs={12}>
                          <CustomFormLabel htmlFor="paid">
                            {t('report.statusChange.paid')}
                          </CustomFormLabel>
                          <OutlinedInput
                            disabled
                            sx={{ width: '100%', border: 'none' }}
                            id="paid"
                            type="number"
                            fullWidth
                            control={control}
                            {...register('paid', { required: true })}
                            size="small"
                            endAdornment={
                              <InputAdornment position="end">{t('currency.toman')}</InputAdornment>
                            }
                          />
                        </Grid>
                        <Grid item lg={6} md={12} xs={12}>
                          <CustomFormLabel htmlFor="retailerPaid">
                            {t('report.statusChange.retailerPaid')}
                          </CustomFormLabel>
                          <OutlinedInput
                            sx={{ width: '100%' }}
                            id="retailerPaid"
                            type="number"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('retailerPaid', { required: true })}
                            error={!!errors.retailerPaid}
                            endAdornment={
                              <InputAdornment position="end">{t('currency.toman')}</InputAdornment>
                            }
                          />
                          <FormHelperText id="standard-weight-helper-text">
                            {errors && errors.retailerPaid && errors.retailerPaid.message}
                          </FormHelperText>
                        </Grid>

                        <Grid item lg={6} md={12} xs={12}>
                          <CustomFormLabel htmlFor="retailerCode">
                            {t('report.statusChange.retailerCode')}
                          </CustomFormLabel>
                          <TextField
                            required
                            id="retailerCode"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('retailerCode')}
                            error={!!errors.retailerCode}
                            helperText={
                              errors && errors.retailerCode && errors.retailerCode.message
                            }
                          />
                        </Grid>
                      </Grid>
                    )}
                    {statusId === ProductStatusEnum.DELIVERED_TO_NGO && (
                      <Grid container spacing={2}>
                        <Grid item lg={12} md={12} xs={12}>
                          <CustomFormLabel htmlFor="product-delivery-to-ngo">
                            {t('report.statusChange.deliveredToNgo')}
                          </CustomFormLabel>
                          <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                            <DateTimePicker
                              id="productDeliveredToNgo"
                              defaultValue={new Date(productDelivered)}
                              control={control}
                              {...register('productDeliveredToNgo', { required: true })}
                              onChange={handleDeliveredChange}
                              renderInput={(params) => <TextField {...params} />}
                              error={!!errors.productDeliveredToNgo}
                            />
                          </LocalizationProvider>
                        </Grid>
                      </Grid>
                    )}
                  </form>
                )}
                {need.type === NeedTypeEnum.SERVICE && (
                  <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {statusId === ServiceStatusEnum.MONEY_TO_NGO && (
                      <Grid container spacing={2}>
                        <Grid item lg={6} md={12} xs={12}>
                          <CustomFormLabel htmlFor="bankTrackId">
                            {t('report.statusChange.bankTrackId')}
                          </CustomFormLabel>
                          <TextField
                            required
                            id="bankTrackId"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('bankTrackId')}
                            error={!!errors.bankTrackId}
                          />
                        </Grid>
                      </Grid>
                    )}
                    {statusId === ServiceStatusEnum.DELIVERED && (
                      <Grid container spacing={2}>
                        <Grid item lg={6} md={12} xs={12}>
                          <CustomFormLabel htmlFor="purchasedCost">
                            {t('report.statusChange.purchasedCost')}
                          </CustomFormLabel>
                          <TextField
                            required
                            id="purchasedCost"
                            variant="outlined"
                            fullWidth
                            size="small"
                            control={control}
                            {...register('purchasedCost')}
                            error={!!errors.purchasedCost}
                            helperText={
                              errors && errors.purchasedCost && errors.purchasedCost.message
                            }
                          />
                        </Grid>
                      </Grid>
                    )}
                  </form>
                )}
              </Grid>
            </Card>
          </DialogContent>
          <DialogActions>
            <LoadingButton
              loading={loadingAStatusUpdate}
              color="primary"
              type="submit"
              variant="outlined"
              disabled={!statusId}
              onClick={handleSubmit(onSubmit)}
            >
              {t('button.update')}
            </LoadingButton>
            <LoadingButton variant="outlined" color="secondary" type="submit" onClick={handleClose}>
              {t('button.cancel')}
            </LoadingButton>
          </DialogActions>
          <ul>
            {errors && errors.retailerPaid && (
              <li>
                <Typography color="error" variant="span">
                  {errors && errors.retailerPaid?.message}
                </Typography>
              </li>
            )}
            {errors && errors.retailerCode && (
              <li>
                <Typography color="error" variant="span">
                  {errors && errors.retailerCode?.message}
                </Typography>
              </li>
            )}
            {errors && errors.productDeliveredToNgo && (
              <li>
                <Typography color="error" variant="span">
                  {errors && errors.productDeliveredToNgo?.message}
                </Typography>
              </li>
            )}
            {errors && errors.expProductToNgo && (
              <li>
                <Typography color="error" variant="span">
                  {errors && errors.expProductToNgo?.message}
                </Typography>
              </li>
            )}
            {errors && errors.bankTrackId && (
              <li>
                <Typography color="error" variant="span">
                  {errors && errors.bankTrackId?.message}
                </Typography>
              </li>
            )}
          </ul>
        </Dialog>
      )}
    </div>
  );
}

StatusDialog.propTypes = {
  need: PropTypes.object,
  statusDialog: PropTypes.bool,
  setStatusDialog: PropTypes.func,
  setStatusNeed: PropTypes.func,
};
