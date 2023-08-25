import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { createComment } from '../../redux/actions/commentAction';
import CommentTextArea from '../dao/comment/CommentTextArea';

export default function CommentDialog({ open, setOpen, message, setMessage, dialogNeed }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const commentResult = useSelector((state) => state.commentResult);
  const { created, loading: loadingCommentResult } = commentResult;

  const handleClose = () => {
    setOpen(false);
  };
  console.log(dialogNeed);
  const submitComment = () => {
    dispatch(
      createComment(dialogNeed.flaskId, dialogNeed.id, message),
    );
  };

  useEffect(() => {
    if (created) {
      setOpen(false);
      setMessage('');
    }
  }, [created]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <IconButton sx={{ position: 'absolute' }} onClick={() => setOpen(false)}>
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText id="alert-dialog-description" sx={{ textAlign: 'center', mb: 3 }}>
            {t('comment.title')}
          </DialogContentText>
          <CommentTextArea message={message} setMessage={setMessage} />
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loadingCommentResult}
            disabled={!message}
            onClick={submitComment}
            autoFocus
          >
            {t('button.submit')}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CommentDialog.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  message: PropTypes.string,
  setMessage: PropTypes.func,
  dialogNeed: PropTypes.object,
};
