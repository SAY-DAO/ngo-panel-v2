/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, Avatar, Badge, Divider, IconButton, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useDispatch, useSelector } from 'react-redux';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import MigrateDialog from '../Dialogs/MigrateDialog';
import { MIGRATE_ONE_CHILD_RESET } from '../../redux/constants/socialWorkerConstants';
import Message from '../Message';

const SocialWorkerChildCard = ({ swChildren, toSwId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const swOneMigrate = useSelector((state) => state.swOneMigrate);
  const { error: errorOneMigrate, success: successOneMigrate } = swOneMigrate;

  const [myChildId, setMyChildId] = useState();
  const [dialogValues, setDialogValues] = useState();
  const [openMigrate, setOpenMigrate] = useState(false);

  useEffect(() => {
    // if (myChildId && successOneMigrate) {
    //   const tempList = swChildren;
    //   console.log(`**swChildren.length (should still be 3) ${swChildren.length}`);
    //   const indx = tempList.findIndex((child) => child.id === myChildId);
    //   tempList.splice(indx, indx >= 0 ? 1 : 0);
    //   console.log(`**tempList.length (should still be 3) ${tempList.length}`);
    // }
    // return () => {
    //   dispatch({ type: MIGRATE_ONE_CHILD_RESET });
    // };
  }, [myChildId, successOneMigrate]);

  const handleMigrateDialog = (id) => {
    console.log('childId2');
    console.log(id);
    console.log('childId2');
    setMyChildId(id);
    setDialogValues({
      fromSw: null,
      toSw: null,
    });
    setOpenMigrate(true);
  };
  return (
    <Card
      sx={{
        p: 0,
        mb: 4,
      }}
    >
      <Box sx={{ mt: -2 }}>
        {swChildren && swChildren[0] ? (
          swChildren.map((child) => (
            <Box key={child.id}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: '0px',
                }}
              >
                <Box display="flex" alignItems="flex-end" justifyContent="space-between">
                  <Box display="flex" alignItems="flex-end" justifyContent="center">
                    <Badge variant="dot">
                      <Avatar
                        src={child.awakeAvatarUrl}
                        alt={child.awakeAvatarUrl}
                        sx={{
                          width: '45px',
                          height: '45px',
                        }}
                      />
                    </Badge>
                    <Box
                      sx={{
                        ml: 2,
                      }}
                    >
                      <Typography variant="h5">{child.sayName}</Typography>
                      <Typography color="textSecondary" variant="h6" fontWeight="400">
                        {child.id} {child.lastName} {child.firstName}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    {successOneMigrate && child.id === myChildId ? (
                      <CheckIcon color="success" />
                    ) : errorOneMigrate && child.id === myChildId ? (
                      <ClearIcon color="error" />
                    ) : (
                      toSwId && (
                        <IconButton
                          onClick={() => handleMigrateDialog(child.id)}
                          sx={{ m: 'auto' }}
                        >
                          <SwapHorizIcon />
                        </IconButton>
                      )
                    )}
                  </Box>
                </Box>
              </Box>
              <Divider />
            </Box>
          ))
        ) : (
          <Typography sx={{ p: 10 }}>{t('socialWorker.noChildren')}</Typography>
        )}
      </Box>
      <MigrateDialog
        open={openMigrate}
        setOpen={setOpenMigrate}
        dialogValues={dialogValues}
        childId={myChildId}
        toSwId={toSwId}
      />
    </Card>
  );
};

export default SocialWorkerChildCard;

SocialWorkerChildCard.propTypes = {
  swChildren: PropTypes.array,
  toSwId: PropTypes.number,
};
