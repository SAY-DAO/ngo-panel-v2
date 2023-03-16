import React from 'react';
import PropTypes from 'prop-types';
import PasswordChecklist from 'react-password-checklist';
import { useTranslation } from 'react-i18next';
import contents from './Contents';

export default function ValidatePassword({ password, confirmPassword, setIsValid }) {
  const { t } = useTranslation();

  const handleValid = (v) => {
    setIsValid(v);
  };

  return (
    <PasswordChecklist
      rules={['minLength', 'specialChar', 'number', 'capital', 'lowercase', 'notEmpty', 'match']}
      minLength={8}
      value={password}
      valueAgain={confirmPassword}
      messages={{
        minLength: t(contents.minLengthPassword),
        specialChar: t(contents.specialCharPassword),
        number: t(contents.numberPassword),
        capital: t(contents.capitalPassword),
        lowercase: t(contents.lowercasePassword),
        notEmpty: t(contents.allRequired),
        match: t(contents.passwordMatch),
      }}
      onChange={(isValid) => handleValid(isValid)}
    />
  );
}

ValidatePassword.propTypes = {
  password: PropTypes.string,
  confirmPassword: PropTypes.string,
  setIsValid: PropTypes.func,
};
