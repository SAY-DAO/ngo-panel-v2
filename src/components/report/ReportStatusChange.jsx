import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Avatar, Box, IconButton, Stack } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { convertFlaskToSayRoles } from '../../utils/helpers';
import {
  NeedTypeEnum,
  ProductStatusEnum,
  SAYPlatformRoles,
  ServiceStatusEnum,
} from '../../utils/types';

export default function ReportStatusChange({ need, setStatusDialog, setStatusNeed }) {
  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const handleStatusChange = (theNeed) => {
    setStatusDialog(true);
    setStatusNeed(theNeed);
  };

  return (
    <Box alignItems="center">
      <IconButton
        disabled={
          convertFlaskToSayRoles(swInfo.typeId) !== SAYPlatformRoles.AUDITOR ||
          (need.type === NeedTypeEnum.SERVICE && need.status === ServiceStatusEnum.DELIVERED) ||
          (need.type === NeedTypeEnum.PRODUCT && need.status === ProductStatusEnum.DELIVERED)
        }
        aria-label="attachment"
        size="small"
        onClick={() => handleStatusChange(need)}
      >
        <Avatar
          src={
            need.status === ProductStatusEnum.COMPLETE_PAY // Complete payment
              ? '/images/hand-orange.svg'
              : need.status === ProductStatusEnum.PURCHASED_PRODUCT &&
                need.type === NeedTypeEnum.PRODUCT // Purchased Product
              ? '/images/package-orange.svg'
              : (need.status === ProductStatusEnum.DELIVERED_TO_NGO &&
                  need.type === NeedTypeEnum.PRODUCT) ||
                (need.status === ServiceStatusEnum.MONEY_TO_NGO &&
                  need.type === NeedTypeEnum.SERVICE) // Sent product to NGO
              ? '/images/package-orange.svg'
              : '/images/child-orange.svg' // Delivered to Child
          }
          alt="icon"
          sx={{
            p: 1,
            m: 'auto',
            border: '1px solid #665a49',
            borderRadius: '50px',
            height: '40px',
            width: '40px',
          }}
        />
      </IconButton>
      <Box>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
          {need.status === ProductStatusEnum.COMPLETE_PAY ? (
            <>
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
            </>
          ) : need.status === ProductStatusEnum.PURCHASED_PRODUCT &&
            need.type === NeedTypeEnum.PRODUCT ? (
            <>
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
            </>
          ) : (need.status === (ProductStatusEnum.DELIVERED_TO_NGO || ProductStatusEnum) &&
              need.type === NeedTypeEnum.PRODUCT) ||
            (need.status === ServiceStatusEnum.MONEY_TO_NGO &&
              need.type === NeedTypeEnum.SERVICE) ? (
            <>
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
            </>
          ) : (
            <>
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
              <CircleIcon sx={{ color: '#00c292' }} fontSize="small" />
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

ReportStatusChange.propTypes = {
  need: PropTypes.object,
  setStatusDialog: PropTypes.func,
  setStatusNeed: PropTypes.func,
};
