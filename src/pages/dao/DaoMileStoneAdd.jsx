/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, Button, Card } from '@mui/material';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import DaoMileStoneForm from './DaoMileStoneForm';
import { createMileStone } from '../../redux/actions/dao/DaoAction';

const BCrumb = [
  {
    to: '/Dao',
    title: 'DAO',
  },
  {
    title: 'Milestone',
  },
];

const ColorlibStepIconRoot = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
}));

const DaoMileStoneAdd = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [stepLabels, setStepLabels] = useState(['Remove', 'Finish', 'Add']);
  const [isAdded, setIsAdded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const [dueDate, setStepDate] = useState(new Date());

  useEffect(() => {
    if (isAdded) {
      const last = stepLabels.length;
      stepLabels.splice(last - 2, 0, `Step ${last - 2}`);
      setStepLabels(stepLabels);
    }
    if (isRemoved) {
      const last = stepLabels.length;
      stepLabels.splice(last - 3, 1);
      setStepLabels(stepLabels);
    }
    return () => {
      setIsAdded(false);
      setIsRemoved(false);
    };
  }, [isAdded, isRemoved]);

  const validationSchema = Yup.object().shape({
    // firstName: Yup.string().required('Please enter your first name'),
    // lastName: Yup.string().required('Please enter your last name'),
    // ngoId: Yup.string().required('Please enter your NGO'),
    // typeId: Yup.string().required('Please enter permission'),
    // idNumber: Yup.string().required('Please enter your ID number'),
    // phoneNumber: Yup.string().required('Please enter your phone number'),
    // emergencyPhoneNumber: Yup.string().required('Please enter your emergency phone'),
    // email: Yup.string().required('Please enter your email'),
    // telegramId: Yup.string().required('Please enter your telegram handle'),
    // acceptTerms: Yup.bool(),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleAddStep = () => {
    console.log(stepLabels);
    if (stepLabels.length <= 8) {
      setIsAdded(true);
    }
  };

  const handleRemoveStep = () => {
    console.log(stepLabels);
    if (stepLabels.length > 3) {
      setIsRemoved(true);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    reset();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    console.log(JSON.stringify(data, null, 2));
    const localData = localStorage.getItem('stepLabels')
      ? JSON.parse(localStorage.getItem('stepLabels'))
      : null;

    localStorage.setItem(
      'stepLabels',
      JSON.stringify({
        stepLabels: `Step ${activeStep + 2}`,
        data: !localData ? [{ ...data, dueDate }] : [...localData.data, { ...data, dueDate }],
      }),
    );
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    localStorage.removeItem('stepLabels');
    reset();
  };

  const handleDateChange = (newValue) => {
    setStepDate(newValue);
  };

  const handleFinish = () => {
    const localData = localStorage.getItem('stepLabels')
      ? JSON.parse(localStorage.getItem('stepLabels'))
      : null;
    dispatch(createMileStone(localData));
    localStorage.removeItem('stepLabels');
  };

  // eslint-disable-next-line consistent-return
  const handleSteps = () => {
    return (
      <Box sx={{ p: 3 }}>
        <DaoMileStoneForm
          dueDate={dueDate}
          handleDateChange={handleDateChange}
          register={register}
          control={control}
          errors={errors}
        />
      </Box>
    );
  };

  function addStepIcon() {
    return (
      <ColorlibStepIconRoot>
        <AddIcon />
      </ColorlibStepIconRoot>
    );
  }

  function removeStepIcon() {
    return (
      <ColorlibStepIconRoot>
        <RemoveIcon />
      </ColorlibStepIconRoot>
    );
  }

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Card>
        <Box sx={{ width: '100%' }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stepper activeStep={activeStep + 1}>
              {stepLabels.map((label) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step
                    key={label}
                    {...stepProps}
                    onClick={() =>
                      label === 'Add'
                        ? handleAddStep()
                        : label === 'Remove'
                        ? handleRemoveStep()
                        : handleAddStep()
                    }
                  >
                    {label === 'Add' ? (
                      <StepLabel StepIconComponent={addStepIcon} {...labelProps}>
                        {label}
                      </StepLabel>
                    ) : label === 'Remove' ? (
                      <StepLabel StepIconComponent={removeStepIcon} {...labelProps}>
                        {label}
                      </StepLabel>
                    ) : (
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    )}
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === stepLabels.length - 2 ? (
              <>
                <Box sx={{ m: 3, p: 2, borderRadius: 1 }}>
                  All stepLabels completed - you&apos;re finished
                </Box>

                <Box display="flex" sx={{ flexDirection: 'row', p: 3 }}>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <Button type="reset" onClick={handleReset} variant="contained" color="error">
                    Reset
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Box>{handleSteps(activeStep)}</Box>
                <Box display="flex" sx={{ flexDirection: 'row', p: 3 }}>
                  <Button
                    color="secondary"
                    variant="contained"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: '1 1 auto' }} />
                  <LoadingButton
                    color="primary"
                    type="click"
                    onClick={
                      activeStep === stepLabels.length - 3 ? handleFinish : handleSubmit(onSubmit)
                    }
                    variant="contained"
                  >
                    {activeStep === stepLabels.length - 3
                      ? t('dao.milestone.button.finish')
                      : t('dao.milestone.button.next')}
                  </LoadingButton>
                </Box>
              </>
            )}
          </form>
        </Box>
      </Card>
    </PageContainer>
  );
};

export default DaoMileStoneAdd;
