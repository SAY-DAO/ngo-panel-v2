import React from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { PropTypes } from 'prop-types';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TollIcon from '@mui/icons-material/Toll';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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
    <>
      <Tooltip title={t(`need.needStatus.${getCurrentStatusString(need)}`)}>
        <Box alignItems="center" sx={{ textAlign: 'center' }}>
          <IconButton
            disabled={
              convertFlaskToSayRoles(swInfo.typeId) !== SAYPlatformRoles.AUDITOR ||
              (need.type === NeedTypeEnum.SERVICE && need.status === ServiceStatusEnum.DELIVERED) ||
              (need.type === NeedTypeEnum.PRODUCT && need.status === ProductStatusEnum.DELIVERED)
            }
            aria-label="attachment"
            size="medium"
            onClick={() => handleStatusChange(need)}
          >
            {
              need.status <= PaymentStatusEnum.NOT_PAID ? (
                <HourglassTopIcon sx={{ width: 35, height: 35 }} />
              ) : need.status === PaymentStatusEnum.PARTIAL_PAY ? (
                <TollIcon sx={{ width: 35, height: 35 }} />
              ) : need.status === PaymentStatusEnum.COMPLETE_PAY ? (
                <PriceCheckIcon sx={{ width: 35, height: 35 }} />
              ) : need.status === ProductStatusEnum.PURCHASED_PRODUCT &&
                need.type === NeedTypeEnum.PRODUCT ? (
                <ShoppingCartIcon sx={{ width: 35, height: 35 }} />
              ) : need.status === ProductStatusEnum.DELIVERED_TO_NGO &&
                need.type === NeedTypeEnum.PRODUCT ? (
                <DeliveryDiningIcon sx={{ width: 35, height: 35 }} />
              ) : need.status === ServiceStatusEnum.MONEY_TO_NGO &&
                need.type === NeedTypeEnum.SERVICE ? (
                <PointOfSaleIcon sx={{ width: 35, height: 35 }} />
              ) : (
                <ChildCareIcon sx={{ width: 35, height: 35 }} />
              ) // Delivered to Child
            }
          </IconButton>
          <Box>
            <Stack direction="row" justifyContent="center" alignItems="center" spacing={0}>
              {need.status === PaymentStatusEnum.NOT_PAID || need.isDeleted !== true ? (
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
      </Tooltip>
    </>
  );
}

ReportStatusChange.propTypes = {
  need: PropTypes.object,
  setStatusDialog: PropTypes.func,
  setStatusNeed: PropTypes.func,
};
