import * as React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Alert, Stack } from '@mui/material';
import contents from '../inputsValidation/Contents';
import '../i18n';

export default function Message({
  icon,
  input,
  frontError,
  backError,
  backSuccess,
  variant,
  children,
  severity,
}) {
  console.log( input, backError.data.message,  variant, children, severity);

  const { t } = useTranslation();
  const onRequestCheck = () => {
    if (backSuccess) {
      return t(contents.successBank);
    }
    if (frontError.status) {
      return t(contents.sthIsWrong);
    }
    if (backError.status) {
      if (backError.status === 600) {
        return t(contents.invalidNeed);
      }
      if (backError.status === 710) {
        return t(contents.wrongUsername);
      }
      if (backError.status === 711) {
        return t(contents.usernameExists);
      }
      if (backError.status === 720) {
        return t(contents.wrongEmail);
      }
      if (backError.status === 721) {
        return t(contents.emailExists);
      }
      if (backError.status === 730) {
        return t(contents.wrongPhone);
      }
      if (backError.status === 731) {
        return t(contents.phoneExists);
      }
      if (backError.status === 743) {
        // family not found
        return t(contents.sthIsWrong);
      }
      if (backError.status === 744) {
        // cannot join this family:
        // role had taken by some one else
        return t(contents.sthIsWrong);
      }
      if (backError.status === 746) {
        // you must back to your old role
        return t(contents.sthIsWrong);
      }
      if (backError.status === 747) {
        // you already take this role
        // you already join this family
        return t(contents.sthIsWrong);
      }
      if (backError.status === 400 && backError.data && input === 'confirm') {
        console.log(backError.data.message);
        return `${backError.data.message}`;
      }
      if (backError.status === 400 && backError.data[0] && input === 'addSw') {
        console.log(backError);
        return `${backError.data[0]} ${backError.data[0].msg}`;
      }
      if (backError.status === 400 && backError.data && input === 'addSw') {
        return `${backError.data.message}`;
      }
      if (backError.status === 400 && input === 'register') {
        return t(contents.sthIsWrong);
      }
      if (backError.status === 400 && input === 'code') {
        return t(contents.wrongCode);
      }
      if (backError.status === 400 && input === 'userName') {
        return t(contents.wrongUserOrPass);
      }
      if (backError.status === 422 && input === 'userName') {
        return t(contents.usernameExists);
      }
      if (backError.status === 422 && input === 'email') {
        return t(contents.emailExists);
      }
      if (backError.status === 422 && input === 'phoneNumber') {
        return t(contents.phoneExists);
      }
      if (backError.status === 429) {
        return t(contents.manyRequest);
      }
      if (backError.status === 499) {
        return t(contents.codeExpired);
      }
      return t(contents.sthIsWrong);
    }
    if (typeof backError === 'string' || typeof frontError === 'string') {
      return backError || frontError;
    }
    return false;
  };

  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
      <Alert icon={icon} variant={variant} severity={severity} sx={{ margin: 'auto' }}>
        {children || onRequestCheck()}
      </Alert>
    </Stack>
  );
}

Message.propTypes = {
  icon: PropTypes.node,
  input: PropTypes.string,
  frontError: PropTypes.any,
  backError: PropTypes.any,
  backSuccess: PropTypes.any,
  variant: PropTypes.string,
  children: PropTypes.string,
  severity: PropTypes.string,
};

Message.defaultProps = {
  icon: <CheckCircleOutlineIcon fontSize="inherit" />,
  input: '',
  frontError: '',
  backError: '',
  children: '',
};
