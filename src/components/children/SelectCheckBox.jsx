import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import { ChildExistenceEnum, ChildConfirmation } from '../../utils/types';

export default function SelectCheckBox({ setFilters }) {
  const { t } = useTranslation();

  const existenceStatus = [
    { title: t('child.statuses.dead'), status: ChildExistenceEnum.DEAD },
    { title: t('child.statuses.aliveAndPresent'), status: ChildExistenceEnum.ALIVE_PRESENT },
    { title: t('child.statuses.aliveAndGone'), status: ChildExistenceEnum.ALIVE_GONE },
    { title: t('child.statuses.tempGone'), status: ChildExistenceEnum.TEMP_GONE },
    { title: t('child.statuses.confirmed'), status: ChildExistenceEnum.CONFIRMED },
    { title: t('child.statuses.migrated'), status: ChildExistenceEnum.MIGRATED },
  ];

  const [values, setValues] = useState([existenceStatus[1].status, existenceStatus[4].status]);

  useEffect(() => {
    console.log(values);
    setFilters({
      statuses: values.filter((v) => v !== ChildExistenceEnum.CONFIRMED),
      isConfirmed:
        values.filter((v) => v !== ChildExistenceEnum.CONFIRMED).length < values.length
          ? ChildConfirmation.CONFIRMED
          : ChildConfirmation.BOTH,
      isMigrated: values.filter((v) => v !== ChildExistenceEnum.MIGRATED).length < values.length,
    });
  }, [values]);

  return (
    <Autocomplete
      value={values}
      onChange={(event, newValue) => {
        setValues(newValue);
      }}
      multiple
      filterSelectedOptions
      id="tags-filled"
      options={existenceStatus.map((option) => option.status)}
      getOptionLabel={(option) => existenceStatus.find((s) => s.status === option).title}
      renderTags={(v, getTagProps) =>
        v.map((option, index) => (
          <Chip
            variant="outlined"
            label={
              (existenceStatus.find((s) => s.status === option) &&
                existenceStatus.find((s) => s.status === option).title) ||
              option
            }
            {...getTagProps({ index })}
          />
        ))
      }
      sx={{ width: '80%', m: 'auto !important', p: 5 }}
      renderOption={(props, option) => (
        <li {...props}>{existenceStatus.find((v) => v.status === option).title}</li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={t('child.existence_status')}
          placeholder={t('child.existence_status')}
        />
      )}
    />
  );
}
SelectCheckBox.propTypes = {
  setFilters: PropTypes.func,
};
