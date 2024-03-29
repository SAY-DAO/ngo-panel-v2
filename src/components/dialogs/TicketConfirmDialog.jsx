import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { NeedTypeEnum, ProductStatusEnum, SAYPlatformRoles } from '../../utils/types';
import { getSAYRoleString } from '../../utils/helpers';
import { addTicket } from '../../redux/actions/ticketAction';
import { UPDATE_TICKET_COLOR_RESET } from '../../redux/constants/ticketConstants';

const ITEM_HEIGHT = 65;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const roles = Object.keys(SAYPlatformRoles);

export default function TicketConfirmDialog({ openConfirm, setOpenConfirm, loading, need }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [selectedRoles, setSelectedRoles] = useState([]);

  const ticketAdd = useSelector((state) => state.ticketAdd);
  const { loading: loadingAddTicket } = ticketAdd;

  const myPage = useSelector((state) => state.myPage);
  const { pageDetails } = myPage;

  const handleClose = () => {
    setOpenConfirm(false);
  };

  const handleConfirm = () => {
    dispatch({ type: UPDATE_TICKET_COLOR_RESET });
    dispatch(
      addTicket({
        roles: selectedRoles,
        title: need.name_translations.en,
        flaskUserId: pageDetails.panelFlaskUserId,
        userTypeId: pageDetails.typeId,
        flaskNeedId: need.id,
        statuses: need.status_updates,
        receipts: need.receipts_,
        payments: need.payments,
      }),
    );
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedRoles(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <div>
      <Dialog open={openConfirm} onClose={handleClose} aria-labelledby="draggable-dialog-title">
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {t('ticket.dialog.title')}
        </DialogTitle>
        <DialogContent>
          <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                {t('ticket.dialog.chatWith')}
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedRoles}
                onChange={handleChange}
                input={<OutlinedInput label={t('ticket.dialog.chatWith')} />}
                renderValue={(selected) =>
                  selected
                    .map((element) => t(`roles.${getSAYRoleString(SAYPlatformRoles[element])}`))
                    .join(', ')
                }
                MenuProps={MenuProps}
              >
                {roles
                  .filter(
                    (r) =>
                      SAYPlatformRoles[r] !== SAYPlatformRoles.NO_ROLE &&
                      SAYPlatformRoles[r] !== SAYPlatformRoles.NGO_SUPERVISOR &&
                      SAYPlatformRoles[r] !== SAYPlatformRoles.FAMILY &&
                      SAYPlatformRoles[r] !== SAYPlatformRoles.RELATIVE &&
                      SAYPlatformRoles[r] !== SAYPlatformRoles.NGO &&
                      SAYPlatformRoles[r] !== SAYPlatformRoles.CHILD 
                  )
                  .map((role) => (
                    <MenuItem
                      disabled={
                        !(
                          SAYPlatformRoles[role] === SAYPlatformRoles.SOCIAL_WORKER ||
                          (need.isConfirmed &&
                            SAYPlatformRoles[role] === SAYPlatformRoles.AUDITOR) ||
                          (SAYPlatformRoles[role] === SAYPlatformRoles.PURCHASER &&
                            need.type === NeedTypeEnum.PRODUCT &&
                            need.status >= ProductStatusEnum.PURCHASED_PRODUCT)
                        )
                      }
                      key={SAYPlatformRoles[role]}
                      value={role}
                    >
                      <Checkbox checked={selectedRoles.indexOf(role) > -1} />
                      <ListItemText
                        primary={t(`roles.${getSAYRoleString(SAYPlatformRoles[role])}`)}
                      />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <DialogContentText>{t('ticket.dialog.confirm')}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            disabled={selectedRoles.length <= 0}
            loading={loadingAddTicket || loading}
            color="primary"
            onClick={() => handleConfirm(selectedRoles)}
          >
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
TicketConfirmDialog.propTypes = {
  setOpenConfirm: PropTypes.func,
  openConfirm: PropTypes.bool,
  loading: PropTypes.bool,
  need: PropTypes.object,
};
