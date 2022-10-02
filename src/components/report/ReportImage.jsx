import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addReceiptToNeed, fetchNeedReceipts } from '../../redux/actions/reportAction';
import UploadImage from '../UploadImage';
import DeleteDialog from '../dialogs/DeleteDialog';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';

export default function ReportImage({ row, statusId }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [uploadImage, setUploadImage] = useState(location.state && location.state.newImage);
  const [finalImageFile, setFinalImageFile] = useState();

  const [dialogValues, setDialogValues] = useState();
  const [openDelete, setOpenDelete] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const receiptList = useSelector((state) => state.receiptList);
  const { receipts, loading: loadingReceiptList } = receiptList;

  const receiptAdd = useSelector((state) => state.receiptAdd);
  const { loading: loadingAdd, success: successAdd } = receiptAdd;

  const receiptDelete = useSelector((state) => state.receiptDelete);
  const { success: successDelete } = receiptDelete;

  useEffect(() => {
    if (finalImageFile && title) {
      dispatch(
        addReceiptToNeed({
          needId: row.id,
          title,
          code,
          needStatus: statusId,
          description,
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
    setOpenDelete(true);
    setDialogValues({
      needId,
      receiptId,
      type: 'delete',
    });
  };
  return (
    <Stack direction="row">
      {loadingReceiptList || loadingAdd ? (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress size={10} />
        </Grid>
      ) : (
        <>
          <div className="upload__image-wrapper">
            <Grid>
              <label htmlFor={statusId}>
                <input
                  accept="image/*"
                  id={statusId}
                  type="file"
                  style={{ display: 'none' }}
                  onChange={onImageChange}
                />

                <IconButton name={statusId} id={statusId} color="primary" component="div">
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
            receipts
              // .filter((receipt) => receipt.needStatus === statusId) // Some service needs does not have status id
              .map((receipt) => (
                <PopupState key={receipt.id} variant="popover" popupId="demo-popup-menu">
                  {(popupState) => (
                    <>
                      <Tooltip
                        arrow
                        title={
                          <>
                            <Typography variant="subtitle1">
                              {receipt.code && receipt.code}
                            </Typography>
                            <Typography variant="subtitle1">
                              {receipt.title && receipt.title}
                            </Typography>
                            <Typography variant="subtitle1">
                              {receipt.description && receipt.description}
                            </Typography>
                            <CardMedia
                              component="img"
                              image={receipt.attachment}
                              alt="large"
                              sx={{ width: '100%' }}
                            />
                          </>
                        }
                        placement="left"
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
                            </IconButton>
                            <Menu {...bindMenu(popupState)}>
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
            <Grid container>
              <CustomFormLabel htmlFor="title">{t('report.receipt.code')}</CustomFormLabel>
              <TextField
                id="code"
                variant="outlined"
                fullWidth
                size="small"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <CustomFormLabel htmlFor="title">{t('report.receipt.title')}</CustomFormLabel>
              <TextField
                required
                id="title"
                variant="outlined"
                fullWidth
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <CustomFormLabel htmlFor="description">
                {t('report.receipt.description')}
              </CustomFormLabel>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={5}
                id="description"
                variant="outlined"
                size="small"
                sx={{ mb: 1 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: '100%', background: 'transparent' }}
              />
            </Grid>

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
      <DeleteDialog open={openDelete} setOpen={setOpenDelete} dialogValues={dialogValues} />
    </Stack>
  );
}

ReportImage.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.number,
  }),
  statusId: PropTypes.number,
};
