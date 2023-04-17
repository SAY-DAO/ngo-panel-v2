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
import AdapterJalaali from '@date-io/jalaali';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { TextField } from '@mui/material';
import { addTicket } from '../../redux/actions/ticketAction';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import TodayCard from '../TodayCard';
import { AnnouncementEnum } from '../../utils/types';

export default function TicketDeliveryDialog({
  openDeliveryAnnouncement,
  setOpenDeliveryAnnouncement,
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
      setOpenDeliveryAnnouncement(false);
    }
  }, [addedTicket]);

  const validationSchema = Yup.object().shape({
    deliveredToNgo: Yup.string().required(t('error.report.deliveredToNgo')),
  });

  const {
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleClose = () => {
    setOpenDeliveryAnnouncement(false);
  };

  const handleArrivaleTimeChange = (newValue) => {
    setArrivalDate(newValue);
  };
  const handleConfirm = () => {
    console.log(need);
    console.log({
      roles: ['AUDITOR'],
      title: need.name_translations.en,
      flaskUserId: pageDetails.userId,
      userTypeId: pageDetails.typeId,
      flaskNeedId: need.id,
      statuses: need.status_updates,
      receipts: need.receipts,
      payments: need.payments,
      announcement: AnnouncementEnum.ARRIVED_AT_NGO,
      arrivalDate,
    });
    dispatch(
      addTicket({
        roles: ['AUDITOR'],
        title: need.name_translations.en,
        flaskUserId: pageDetails.userId,
        userTypeId: pageDetails.typeId,
        flaskNeedId: need.id,
        statuses: need.status_updates,
        receipts: need.receipts,
        payments: need.payments,
        announcement: AnnouncementEnum.ARRIVED_AT_NGO,
        arrivalDate,
      }),
    );
  };

  return (
    <div>
      <Dialog
        open={openDeliveryAnnouncement}
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
              <CustomFormLabel htmlFor="exp-product-delivery-to-ngo">
                {t('report.statusChange.deliveredToNgo')}
              </CustomFormLabel>
              <LocalizationProvider dateAdapter={AdapterJalaali} adapterLocale="fa-IR">
                <DateTimePicker
                  id="deliveredToNgo"
                  value={arrivalDate}
                  control={control}
                  {...register('deliveredToNgo', { required: true })}
                  onChange={handleArrivaleTimeChange}
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
    </div>
  );
}
TicketDeliveryDialog.propTypes = {
  setOpenDeliveryAnnouncement: PropTypes.func,
  openDeliveryAnnouncement: PropTypes.bool,
  loading: PropTypes.bool,
  need: PropTypes.object,
};
