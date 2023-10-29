import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Container, Tabs } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import ChildrenPreRegisterList from './ChildrenPreRegisterList';
import { FlaskUserTypesEnum } from '../../utils/types';

export default function ChildrenPreRegisterTabs() {
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const [value, setValue] = useState(0);

  const BCrumb = [
    {
      to: '/',
      title: t('BCrumb.home'),
    },
    {
      title: t('BCrumb.childrenPreList'),
    },
  ];

  useEffect(() => {
    if (swInfo) {
      if (
        swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN
      ) {
        setValue(0);
      } else {
        setValue(1);
      }
    }
  }, [swInfo]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container>
      {/* breadcrumb */}
      <Breadcrumb items={BCrumb} />
      {/* end breadcrumb */}
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChange} centered>
          {swInfo &&
            (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
              swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
              <Tab label={t('child.preRegister.tabs.notRegistered')} />
            )}
          <Tab label={t('child.preRegister.tabs.preregistered')} />
          <Tab label={t('child.preRegister.tabs.confirmed')} />
        </Tabs>
        {swInfo && value === 0 && <ChildrenPreRegisterList isApproved={false} tabNumber={value} />}
        {value === 1 && <ChildrenPreRegisterList isApproved={false} tabNumber={value} />}
        {value === 2 && <ChildrenPreRegisterList isApproved tabNumber={value} />}
      </Box>
    </Container>
  );
}
