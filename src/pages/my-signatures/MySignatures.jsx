import React, { useState, useEffect } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllSignatures, fetchUserSignatures } from '../../redux/actions/blockchainAction';
import SignatureCard from '../../components/dao/my-signatures/SignatureCard';
import { FlaskUserTypesEnum } from '../../utils/types';

export default function MySignatures() {
  const dispatch = useDispatch();

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
          <Tab label="socialWorker-signed" />
          <Tab label="auditor-signed" />
          <Tab label="read-to-mint" />
        </Tabs>
      </Box>

      <ImageList variant="standard" cols={6} gap={2}>
        {(userSignatures || allSignatures || []).map((s) => (
          <ImageListItem key={s.id}>
            <SignatureCard
              signatureHash={s.hash}
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
