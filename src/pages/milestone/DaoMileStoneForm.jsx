/* eslint-disable react/prop-types */
import React from 'react';
import { Card, Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import PageContainer from '../../components/container/PageContainer';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';

const DaoMileStoneForm = ({ handleDateChange, dueDate, register, control, errors }) => {
  const { t } = useTranslation();

  return (
    <PageContainer title="MileStone Add" description="this is MileStone Add page">
      <>
        <Card sx={{ p: 3, width: '100%' }}>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={6}>
              <CustomFormLabel htmlFor="needId">{t('need.id')}</CustomFormLabel>
              <TextField
                id="needId"
                variant="outlined"
                type="number"
                fullWidth
                sx={{ mb: 1 }}
                control={control}
                {...register('need_id')}
                error={!!errors.title}
                helperText={errors && errors.title && errors.title.message}
              />
            </Grid>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={12}>
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
            </Grid>
            <Grid item xs>
              <CustomFormLabel htmlFor="dueDate">{t('dao.milestone.duetime')}</CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  id="dueDate"
                  inputFormat="MM/dd/yyyy"
                  value={dueDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  helperText={errors && errors.dueDate && errors.dueDate.message}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Card>
      </>
    </PageContainer>
  );
};

export default DaoMileStoneForm;
