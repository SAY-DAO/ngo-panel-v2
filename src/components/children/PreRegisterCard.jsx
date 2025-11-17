import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { PropTypes } from 'prop-types';
import { useTranslation } from 'react-i18next';
import FeatherIcon from 'feather-icons-react';
import { apiDao } from '../../env';
import {
  EducationEnum,
  FlaskUserTypesEnum,
  HousingStatusEnum,
  PreRegisterStatusEnum,
  SchoolTypeEnum,
  SexEnum,
} from '../../utils/types';
import VoiceBar from '../VoiceBar';
import { getAge, prepareUrl } from '../../utils/helpers';

const trainees = process.env.REACT_APP_TRAINEE_IDS
  ? process.env.REACT_APP_TRAINEE_IDS.split(',').map(Number)
  : [];

function PreRegisterCard({
  preRegistered,
  setDeleteDialogValues,
  setApproveDialogValues,
  setUpdateDialogValues,
  setOpenDelete,
  setOpenApprove,
  setOpenUpdate,
}) {
  const { t } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const handleDelete = (id) => {
    setOpenDelete(true);
    setDeleteDialogValues({
      preRegisterId: id,
      type: 'deletePreregister',
    });
  };

  const handleApprove = (preRegister) => {
    setOpenApprove(true);
    setApproveDialogValues({
      preRegisterId: preRegister.id,
      originalVoice: preRegister.voiceUrl,
    });
  };

  const handleUpdate = (preRegister) => {
    setOpenUpdate(true);
    setUpdateDialogValues(preRegister);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <Card elevation={5} sx={{ height: 480, minWidth: 280 }}>
      <Box
        sx={{
          position: 'absolute',
        }}
      >
        <Tooltip title={t('myPage.taskCard.menu.more')}>
          <IconButton
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <FeatherIcon icon="more-vertical" width="18" />
          </IconButton>
        </Tooltip>

        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {swInfo &&
            (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
              swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN) && (
              <div>
                {preRegistered.status === PreRegisterStatusEnum.PRE_REGISTERED && (
                  <MenuItem onClick={() => handleApprove(preRegistered)}>
                    {t('button.confirm')}
                  </MenuItem>
                )}

                {!trainees.includes(swInfo.id) && (
                  <MenuItem onClick={() => handleDelete(preRegistered.id)}>
                    {t('button.delete')}
                  </MenuItem>
                )}
              </div>
            )}
          {(preRegistered.status === PreRegisterStatusEnum.PRE_REGISTERED ||
            (preRegistered.status === PreRegisterStatusEnum.CONFIRMED &&
              (swInfo.typeId === FlaskUserTypesEnum.ADMIN ||
                swInfo.typeId === FlaskUserTypesEnum.SUPER_ADMIN))) && (
            <MenuItem onClick={() => handleUpdate(preRegistered)}>{t('button.update')}</MenuItem>
          )}
          {preRegistered.status === PreRegisterStatusEnum.CONFIRMED && (
            <MenuItem>Child Id: {preRegistered.flaskChildId}</MenuItem>
          )}
        </Menu>
      </Box>
      <Grid container justifyContent="center" spacing={2}>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Avatar
              sx={{ width: 50, height: 50, m: 'auto' }}
              src={
                preRegistered.awakeUrl.includes('files')
                  ? prepareUrl(preRegistered.awakeUrl)
                  : `${apiDao}/children/avatars/images/${preRegistered.awakeUrl}`
              }
            />
          </Grid>
          <Grid item xs={6}>
            <Avatar
              sx={{ width: 50, height: 50, m: 'auto' }}
              src={
                preRegistered.sleptUrl.includes('files')
                  ? prepareUrl(preRegistered.sleptUrl)
                  : `${apiDao}/children/avatars/images/${preRegistered.sleptUrl}`
              }
            />
          </Grid>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              m: 'auto',
            }}
          >
            {preRegistered.firstName ? preRegistered.firstName.fa : '-'}{' '}
            {preRegistered.lastName ? preRegistered.lastName.fa : '-'}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 200 }}>
            ({preRegistered.sayName ? preRegistered.sayName.fa : '-'})
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 200 }}>
            {preRegistered.birthDate ? `${getAge(preRegistered.birthDate)} ` : ' - '}
            {t('child.years')}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 200 }}>
            {`${preRegistered.familyCount} ${t('child.people')}`}
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ textAlign: 'center' }}>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              mb: 1,
            }}
          >
            {preRegistered.birthPlaceName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 200,
            }}
          >
            {preRegistered.location && preRegistered.location.countryName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 200,
            }}
          >
            {preRegistered.location && preRegistered.location.stateName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              maxWidth: '120px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 200,
            }}
          >
            {preRegistered.location && preRegistered.location.name}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          {preRegistered.voiceUrl ? (
            <VoiceBar
              url={
                preRegistered.voiceUrl.includes('files')
                  ? prepareUrl(preRegistered.voiceUrl)
                  : `${apiDao}/children/voices/${preRegistered.voiceUrl}`
              }
            />
          ) : (
            <Card sx={{ minHeight: 40, mt: 0, mb: 0 }} elevation={2} />
          )}
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography
            sx={{
              maxWidth: '200px !important',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              height: '1.2em',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              m: 'auto',
            }}
          >
            {preRegistered.ngo && preRegistered.ngo.name}
          </Typography>
          <Typography sx={{ fontSize: 10, fontWeight: 200 }}>
            {preRegistered.socialWorker &&
              `${preRegistered.socialWorker.firstName} ${preRegistered.socialWorker.lastName}`}
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          {preRegistered.voiceUrl ? (
            <Card sx={{ minHeight: 60, m: 0 }} elevation={2}>
              <Typography
                sx={{
                  textAlign: 'start',
                  fontSize: 10,
                  overflow: 'scroll',
                  height: '8em',
                  justifyContent: 'flex-end',
                }}
              >
                {preRegistered && preRegistered.bio && preRegistered.bio.fa}
              </Typography>
            </Card>
          ) : (
            <Card sx={{ minHeight: 110, m: 0 }} elevation={2} />
          )}
        </Grid>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Stack direction="row" spacing={1} sx={{ display: 'block', minHeight: 60 }}>
            <Chip
              label={
                typeof preRegistered.sex === 'number' &&
                t(
                  `child.sexKind.${Object.keys(SexEnum)
                    .find((k) => SexEnum[k] === preRegistered.sex)
                    .toLowerCase()}`,
                )
              }
              sx={{
                color: (theme) =>
                  preRegistered.sex === SexEnum.FEMALE
                    ? theme.palette.collections.c4.color1
                    : theme.palette.collections.c4.color4,
                borderColor: (theme) =>
                  preRegistered.sex === SexEnum.FEMALE
                    ? theme.palette.collections.c4.color1
                    : theme.palette.collections.c4.color4,
              }}
              variant="outlined"
            />
            <Chip
              label={
                preRegistered &&
                typeof preRegistered.housingStatus === 'number' &&
                t(
                  `child.housingCondition.${Object.keys(HousingStatusEnum).find(
                    (k) => HousingStatusEnum[k] === preRegistered.housingStatus,
                  )}`,
                )
              }
              color="primary"
              variant="outlined"
            />
            {preRegistered.educationLevel >= 0 && (
              <Chip
                label={
                  preRegistered &&
                  typeof preRegistered.educationLevel === 'number' &&
                  t(
                    `child.educationCondition.${Object.keys(EducationEnum).find(
                      (k) => EducationEnum[k] === preRegistered.educationLevel,
                    )}`,
                  )
                }
                color="primary"
                variant="outlined"
              />
            )}

            {preRegistered.schoolType >= SchoolTypeEnum.DEAF && (
              <Chip
                label={
                  preRegistered &&
                  typeof preRegistered.schoolType === 'number' &&
                  preRegistered.schoolType >= SchoolTypeEnum.DEAF
                    ? t(
                        `child.schoolTypeCondition.${Object.keys(SchoolTypeEnum)
                          .find((k) => SchoolTypeEnum[k] === preRegistered.schoolType)
                          .toLowerCase()}`,
                      )
                    : preRegistered.schoolType
                }
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Grid>
      </Grid>
    </Card>
  );
}

export default PreRegisterCard;

PreRegisterCard.propTypes = {
  preRegistered: PropTypes.object,
  setDeleteDialogValues: PropTypes.func,
  setApproveDialogValues: PropTypes.func,
  setOpenDelete: PropTypes.func,
  setOpenApprove: PropTypes.func,
  setOpenUpdate: PropTypes.func,
  setUpdateDialogValues: PropTypes.func,
};
