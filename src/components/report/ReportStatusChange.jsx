import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Avatar, Box, IconButton, Stack, Tooltip } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { convertFlaskToSayRoles, getCurrentStatusString } from '../../utils/helpers';
import {
  NeedTypeEnum,
  PaymentStatusEnum,
  ProductStatusEnum,
  SAYPlatformRoles,
  ServiceStatusEnum,
} from '../../utils/types';

export default function ReportStatusChange({ need, setStatusDialog, setStatusNeed }) {
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const handleStatusChange = (theNeed) => {
    setStatusDialog(true);
    setStatusNeed(theNeed);
  };

  return (
    <Box alignItems="center" sx={{ textAlign: 'center' }}>
      <Tooltip title={t(`need.needStatus.${getCurrentStatusString(need)}`)}>
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
              need.status <= PaymentStatusEnum.NOT_PAID
                ? ''
                : need.status === PaymentStatusEnum.COMPLETE_PAY ||
                  need.status === PaymentStatusEnum.PARTIAL_PAY
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
      </Tooltip>
      <Box>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
          {need.status === PaymentStatusEnum.NOT_PAID ? (
            <>
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
              <CircleIcon sx={{ color: '#a3a3a3' }} fontSize="small" />
            </>
          ) : need.status === PaymentStatusEnum.COMPLETE_PAY ||
            need.status === PaymentStatusEnum.PARTIAL_PAY ? (
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
