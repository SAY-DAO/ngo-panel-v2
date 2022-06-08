/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  Grid,
  CircularProgress,
  Avatar,
  Menu,
  MenuItem,
  CardMedia,
  Stack,
  DialogActions,
  Button,
  DialogContent,
  Dialog,
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AlertDialog from '../AlertDialog';
import { addReceiptToNeed, fetchNeedReceipts } from '../../redux/actions/reportAction';
import UploadImage from '../UploadImage';

export default function ReportImage({ row, statusId }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [finalImageFile, setFinalImageFile] = useState();

  const [dialogValues, setDialogValues] = useState();
  const [openDelete, setOpenDelete] = useState(false);

  const receiptList = useSelector((state) => state.receiptList);
  const { receipts, loading: loadingReceiptList } = receiptList;

  const receiptAdd = useSelector((state) => state.receiptAdd);
  const { loading: loadingAdd, success: successAdd } = receiptAdd;

  const receiptDelete = useSelector((state) => state.receiptDelete);
  const { success: successDelete } = receiptDelete;

  useEffect(() => {
    if (finalImageFile) {
      dispatch(
        addReceiptToNeed({
          needId: row.id,
          code: 1,
          title: 'test',
          needStatus: statusId,
          description: 'tests',
          attachment: finalImageFile,
        }),
      );
    }
  }, [finalImageFile]);

  // after adding
  useEffect(() => {
    if ((successAdd && finalImageFile) || successDelete) {
      dispatch(fetchNeedReceipts(row.id));
      setFinalImageFile();
    }
  }, [successAdd, successDelete]);

  // dialog image
  const handleImageClickOpen = () => {
    setOpenImageDialog(true);
  };
  const handleImageClose = () => {
    setOpenImageDialog(false);
  };

  const onImageChange = (e) => {
    if (e.target.files[0]) {
      setUploadImage(e.target.files[0]);
      handleImageClickOpen();
    }
  };

  const handleDeleteDialog = (needId, receiptId) => {
    console.log(needId, receiptId);
    setOpenDelete(true);
    setDialogValues({
      needId,
      receiptId,
    });
  };
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {loadingReceiptList || loadingAdd ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress size={10} />
        </Grid>
      ) : (
        <>
          <div className="upload__image-wrapper">
            <Grid>
              <label htmlFor="upload-image">
                <input
                  accept="image/*"
                  id="upload-image"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={onImageChange}
                />

                <IconButton name="upload-image" id="upload-image" color="primary" component="div">
                  <AddCircleOutlineIcon
                    color="primary"
                    fontSize="small"
                    sx={{
                      zIndex: 10,
                      borderRadius: '20%',
                    }}
                  />
                </IconButton>
              </label>
            </Grid>
          </div>

          {receipts &&
            receipts.map((receipt) => (
              <PopupState key={receipt.id} variant="popover" popupId="demo-popup-menu">
                {(popupState) => (
                  <>
                    <Tooltip
                      arrow
                      title={
                        <CardMedia
                          component="img"
                          image={receipt.attachment}
                          alt="large"
                          sx={{ width: '100%' }}
                        />
                      }
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <>
                          <IconButton {...bindTrigger(popupState)}>
                            <Avatar
                              alt="receipt"
                              sx={{ width: 20, height: 20 }}
                              src={receipt.attachment}
                            />
                            {receipt.id}
                          </IconButton>
                          <Menu {...bindMenu(popupState)}>
                            {receipt.id}

                            <MenuItem onClick={() => handleDeleteDialog(row.id, receipt.id)}>
                              {t('button.delete')}
                            </MenuItem>
                            <MenuItem onClick={popupState.close}>{t('button.cancel')}</MenuItem>
                          </Menu>
                        </>
                      </Box>
                    </Tooltip>
                  </>
                )}
              </PopupState>
            ))}
        </>
      )}
      {/* Receipt Image */}
      <Dialog
        open={openImageDialog}
        onClose={handleImageClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <Box>
            <UploadImage
              uploadImage={uploadImage}
              handleImageClose={handleImageClose}
              setFinalImageFile={setFinalImageFile}
              customBorderRadius={1}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImageClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <AlertDialog open={openDelete} setOpen={setOpenDelete} dialogValues={dialogValues} />
    </Stack>
  );
}
