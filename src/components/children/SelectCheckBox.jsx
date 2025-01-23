import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Chip } from '@mui/material';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ChildExistenceEnum, ChildConfirmation, FlaskUserTypesEnum } from '../../utils/types';

export default function SelectCheckBox({ setFilters }) {
  const { t } = useTranslation();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const existenceStatus = [
    { title: t('child.statuses.confirmed'), status: ChildExistenceEnum.confirmed },
    { title: t('child.statuses.dead'), status: ChildExistenceEnum.DEAD },
    { title: t('child.statuses.aliveAndPresent'), status: ChildExistenceEnum.aliveAndPresent },
    { title: t('child.statuses.aliveAndGone'), status: ChildExistenceEnum.aliveAndGone },
    { title: t('child.statuses.tempGone'), status: ChildExistenceEnum.tempGone },
    { title: t('child.statuses.migrated'), status: ChildExistenceEnum.migrated },
  ];

  const [values, setValues] = useState([existenceStatus[0].status, existenceStatus[2].status]);

  useEffect(() => {
    if (swInfo) {
      setFilters({
        statuses: values.filter((v) => v !== ChildExistenceEnum.confirmed),
        isConfirmed:
          values.filter((v) => v !== ChildExistenceEnum.confirmed).length < values.length
            ? ChildConfirmation.CONFIRMED
            : ChildConfirmation.BOTH,
        isMigrated: values.filter((v) => v !== ChildExistenceEnum.migrated).length < values.length,
      });
    }
  }, [values, swInfo]);

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
        swInfo &&
        v.map((option, index) => (
          <Chip
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            variant="outlined"
            label={
              (existenceStatus.find((s) => s.status === option) &&
                existenceStatus.find((s) => s.status === option).title) ||
              option
            }
            tabIndex={getTagProps({ index }).tabIndex}
            onDelete={getTagProps({ index }).onDelete}
            data-tag-index={getTagProps({ index })['data-tag-index']}
            disabled={
              (swInfo.typeId !== FlaskUserTypesEnum.ADMIN &&
                swInfo.typeId !== FlaskUserTypesEnum.SUPER_ADMIN &&
                existenceStatus.find((s) => s.status === option) &&
                existenceStatus.find((s) => s.status === option).status ===
                  ChildExistenceEnum.confirmed) ||
              !swInfo
            }
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
