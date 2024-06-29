import React, { useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Grid, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Message from '../../components/Message';
import { sendNewsLetter } from '../../redux/actions/campaignAction';
import { SEND_NEWSLETTER_CAMPAIGN_RESET } from '../../redux/constants/campaignConstants';

export default function DaoNewsLetterCampaign() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const campaignNewsLetter = useSelector((state) => state.campaignNewsLetter);
  const {
    success: successNewsLetter,
    loading: loadingNewsLetter,
    error: errorNewsLetter,
  } = campaignNewsLetter;

  const validationSchema = Yup.object().shape({
    nestName: Yup.string().required('Please enter your file name'),
  });

  const { register, control, handleSubmit, reset } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    if (successNewsLetter) {
      reset();
    }
  }, [successNewsLetter]);

  const onSubmit = async (data) => {
    dispatch({ type: SEND_NEWSLETTER_CAMPAIGN_RESET });
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);

    dispatch(
      sendNewsLetter({
        isTest: false,
        fileName: data.nestName,
        title: data.title,
        smsLink: data.smsLink,
        smsContent: data.smsContent,
      }),
    );
  };
  const onTestSubmit = async (data) => {
    dispatch({ type: SEND_NEWSLETTER_CAMPAIGN_RESET });
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(300);

    dispatch(
      sendNewsLetter({
        isTest: true,
        fileName: data.nestName,
        title: data.title,
        smsLink: data.smsLink,
        smsContent: data.smsContent,
      }),
    );
  };
  return (
    <>
      <Grid container sx={{ width: '100%' }}>
        <Grid item lg={12} md={8} xs={12} sx={{ margin: 'auto' }}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              {t('campaigns.newsletterContext.title')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ textAlign: 'center' }}
                spacing={1}
              >
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="title">{t('campaigns.title')}</CustomFormLabel>
                  <TextField
                    required
                    id="title"
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                    control={control}
                    {...register('title')}
                    placeholder="email title"
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="nestName">
                    {t('campaigns.newsletterContext.nestName')}
                  </CustomFormLabel>
                  <TextField
                    required
                    id="nestName"
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                    control={control}
                    {...register('nestName')}
                    placeholder="accEmail, ..."
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="nestName">
                    {t('campaigns.newsletterContext.smsLink')}
                  </CustomFormLabel>
                  <TextField
                    required
                    id="smsLink"
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                    control={control}
                    {...register('smsLink')}
                    placeholder="https://campaign.org"
                  />
                </Grid>
                <Grid item xs={6}>
                  <CustomFormLabel htmlFor="nestName">
                    {t('campaigns.newsletterContext.smsContent')}
                  </CustomFormLabel>
                  <TextField
                    required
                    id="smsContent"
                    variant="outlined"
                    size="small"
                    sx={{ width: '100%' }}
                    control={control}
                    {...register('smsContent')}
                    placeholder="content"
                  />
                </Grid>
              </Grid>
              <Grid container justifyContent="center" sx={{ mt: 4 }}>
                <LoadingButton
                  loading={loadingNewsLetter}
                  color="primary"
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  variant="outlined"
                  sx={{ m: 2 }}
                >
                  {t('button.finish')}
                </LoadingButton>
                <LoadingButton
                  loading={loadingNewsLetter}
                  color="secondary"
                  type="submit"
                  onClick={handleSubmit(onTestSubmit)}
                  variant="outlined"
                  sx={{ m: 2 }}
                >
                  {t('button.finish-test')}
                </LoadingButton>
              </Grid>
            </form>
          </Card>
          <Grid>
            {(successNewsLetter || errorNewsLetter) && (
              <Message
                severity={successNewsLetter ? 'success' : 'error'}
                variant="filled"
                input="addSw"
                backError={errorNewsLetter}
                sx={{ width: '100%' }}
              >
                {successNewsLetter && t('provider.updated')}
              </Message>
            )}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
DaoNewsLetterCampaign.propTypes = {
  setOpenConfirm: PropTypes.func,
  openConfirm: PropTypes.bool,
  loading: PropTypes.bool,
  need: PropTypes.object,
};
