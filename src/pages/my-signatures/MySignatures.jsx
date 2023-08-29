import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchAllSignatures, fetchUserSignatures } from '../../redux/actions/blockchainAction';
import SignatureCard from '../../components/dao/my-signatures/SignatureCard';
import { FlaskUserTypesEnum } from '../../utils/types';

export default function MySignatures() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [value, setValue] = useState(0);
  const [cardSelected, setCardSelected] = useState();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const { allSignatures, userSignatures } = useSelector((state) => state.signatures);

  useEffect(() => {
    if (
      swInfo &&
      !(
        swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN
      )
    ) {
      if (value === 0) {
        dispatch(fetchUserSignatures());
      }
      if (value === 1) {
        // dispatch(fetchMySignatures());
      }
      if (value === 2) {
        // dispatch(fetchMySignatures());
      }
    } else if (
      swInfo &&
      (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
        swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN)
    ) {
      if (value === 0) {
        dispatch(fetchAllSignatures());
      }
      if (value === 1) {
        // dispatch(fetchMySignatures());
      }
      if (value === 2) {
        // dispatch(fetchMySignatures());
      }
    }
  }, [value, swInfo]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label={t('mySignatures.tabs.swSignatures')} />
          <Tab disabled label={t('mySignatures.tabs.familySigned')} />
          <Tab disabled label={t('mySignatures.tabs.auditorSigned')} />
        </Tabs>
      </Box>

      <ImageList variant="standard" cols={5} gap={1}>
        {(userSignatures || allSignatures || []).map((s) => (
          <ImageListItem key={s.id}>
            <SignatureCard
              signature={s}
              cardSelected={cardSelected}
              setCardSelected={setCardSelected}
              need={s.need}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </>
  );
}
