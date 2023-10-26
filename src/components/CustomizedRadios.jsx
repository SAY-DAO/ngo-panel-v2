import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { Container } from '@mui/material';
import { ChildExistenceEnum } from '../utils/types';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
  ({ theme, checked }) => ({
    '.MuiFormControlLabel-label': checked && {
      color: theme.palette.primary.main,
    },
  }),
);

function MyFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;
  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }
  return <StyledFormControlLabel checked={checked} {...props} />;
}

MyFormControlLabel.propTypes = {
  value: PropTypes.any,
};

export default function CustomizedRadios({ values, setSelectedValue, selectedValue }) {
  const { t } = useTranslation();

  useEffect(() => {
    if (values) {
      if (values.currentStatus === ChildExistenceEnum.DEAD) {
        setSelectedValue(ChildExistenceEnum.DEAD);
      } else if (values.currentStatus === ChildExistenceEnum.ALIVE_PRESENT) {
        setSelectedValue(ChildExistenceEnum.ALIVE_PRESENT);
      } else if (values.currentStatus === ChildExistenceEnum.ALIVE_GONE) {
        setSelectedValue(ChildExistenceEnum.ALIVE_GONE);
      } else if (values.currentStatus === ChildExistenceEnum.TEMP_GONE) {
        setSelectedValue(ChildExistenceEnum.TEMP_GONE);
      }
    }
  }, [values]);

  const handleChange = (event) => {
    setSelectedValue(Number(event.target.value));
  };

  return (
    <Container>
      {selectedValue >= 0 && (
        <RadioGroup name="use-radio-group" value={selectedValue} onChange={handleChange}>
          {/* 0 dead :( | 1 alive and present | 2 alive but gone | 3 Temporary gone */}
          <MyFormControlLabel
            value={ChildExistenceEnum.DEAD}
            label={`${ChildExistenceEnum.DEAD} - ${t('child.statuses.dead')}`}
            control={<Radio />}
          />
          <MyFormControlLabel
            value={ChildExistenceEnum.ALIVE_PRESENT}
            label={`${ChildExistenceEnum.ALIVE_PRESENT} - ${t('child.statuses.aliveAndPresent')}`}
            control={<Radio />}
          />
          <MyFormControlLabel
            value={ChildExistenceEnum.ALIVE_GONE}
            label={`${ChildExistenceEnum.ALIVE_GONE} - ${t('child.statuses.aliveAndGone')}`}
            control={<Radio />}
          />
          <MyFormControlLabel
            value={ChildExistenceEnum.TEMP_GONE}
            label={`${ChildExistenceEnum.TEMP_GONE} - ${t('child.statuses.tempGone')}`}
            control={<Radio />}
          />
        </RadioGroup>
      )}
    </Container>
  );
}

CustomizedRadios.propTypes = {
  values: PropTypes.object,
  setSelectedValue: PropTypes.func,
  selectedValue: PropTypes.number,
};
