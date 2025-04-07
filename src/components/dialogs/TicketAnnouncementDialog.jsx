import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import FormControl from '@mui/material/FormControl';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField, Typography } from '@mui/material';
import { addTicket } from '../../redux/actions/ticketAction';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import TodayCard from '../TodayCard';
import { AnnouncementEnum, NeedTypeEnum, ProductStatusEnum } from '../../utils/types';
import { daysDifference } from '../../utils/helpers';

export default function TicketAnnouncementDialog({
  openAnnouncement,
  setOpenAnnouncement,
  loading,
  need,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [arrivalDate, setArrivalDate] = useState(new Date());

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { addedTicket } = ticketAdd;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  useEffect(() => {
    if (addedTicket) {
      setOpenAnnouncement({
        arrival: false,
        moneyReceived: false,
      });
    }
  }, [addedTicket]);

  const validationSchema = Yup.object().shape({
    deliveredToNgo: Yup.string().required(t('error.report.deliveredToNgo')),
  });

  const {
    register,
    control,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleClose = () => {
    setOpenAnnouncement({
      arrival: false,
      moneyReceived: false,
    });
  };

  const handleArrivalsTimeChange = (newValue) => {
    setArrivalDate(newValue);
  };

  const handleConfirm = () => {
    if (arrivalDate && daysDifference(new Date(), arrivalDate)) {
      dispatch(
        addTicket({
          roles: ['AUDITOR'],
          title: need.name_translations.en,
          flaskUserId: pageDetails.panelFlaskUserId,
          userTypeId: pageDetails.typeId,
          flaskNeedId: need.id,
          statuses: need.status_updates,
          receipts: need.receipts_,
          payments: need.payments,
          announcement: openAnnouncement.arrival
            ? AnnouncementEnum.ARRIVED_AT_NGO
            : openAnnouncement.moneyReceived && AnnouncementEnum.NGO_RECEIVED_MONEY,
          arrivalDate,
        }),
      );
    } else {
      setError('arrivalDate', {
        message: 'تاریح را بررسی کنید',
        type: 'required',
      });
    }
  };

  useEffect(() => {
    if (
      need &&
      need.type === NeedTypeEnum.PRODUCT &&
      need.status === ProductStatusEnum.PURCHASED_PRODUCT
    ) {
      setArrivalDate(new Date(need.expected_delivery_date));
    }
  }, [need]);

  return (
    <div>
      <Dialog
        open={openAnnouncement.arrival || openAnnouncement.moneyReceived}
        onClose={handleClose}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {t('ticket.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <div>
            <TodayCard />
            <FormControl sx={{ m: 1, width: 300 }}>
              {openAnnouncement.arrival ? (
                <CustomFormLabel htmlFor="exp-product-delivery-to-ngo">
                  {t('report.statusChange.deliveredToNgo')}
                </CustomFormLabel>
              ) : (
                openAnnouncement.moneyReceived && (
                  <CustomFormLabel htmlFor="exp-product-delivery-to-ngo">
                    {t('report.statusChange.moneyToNgo')}
                  </CustomFormLabel>
                )
              )}

              <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <DateTimePicker
                  id="deliveredToNgo"
                  value={arrivalDate}
                  control={control}
                  {...register('deliveredToNgo', { required: true })}
                  onChange={handleArrivalsTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                  error={!!errors.deliveredToNgo}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <DialogContentText>{t('ticket.dialog.confirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton loading={loading} color="primary" onClick={() => handleConfirm()}>
            {t('button.confirm')}
          </LoadingButton>
          <Button autoFocus color="secondary" onClick={handleClose}>
            {t('button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
      <ul>
        {errors && errors.arrivalDate && (
          <li>
            <Typography color="error" variant="span">
              {errors && errors.arrivalDate?.message}
            </Typography>
          </li>
        )}
      </ul>
    </div>
  );
}
TicketAnnouncementDialog.propTypes = {
  setOpenAnnouncement: PropTypes.func,
  openAnnouncement: PropTypes.object,
  loading: PropTypes.bool,
  need: PropTypes.object,
};
