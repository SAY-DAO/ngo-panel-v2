/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, IconButton, CircularProgress, Slider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';

const PrettySlider = styled((props) => <Slider {...props} />)({
  root: {
    color: '#f59e39',
    height: 8,
  },
  thumb: {
    top: '50%',
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginLeft: -12,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
});

// eslint-disable-next-line react/prop-types
export default function UploadImage({
  uploadImage,
  handleImageClose,
  setFinalImageFile,
  customBorderRadius,
}) {
  const { t } = useTranslation();
  // const navigate = useNavigate();
  const location = useLocation();

  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [editor, setEditor] = useState(null);
  const [file, setFile] = useState(); // from ProfileEdit.jsx
  // const [thumb, setThumb] = useState(null);

  useEffect(() => {
    // setFile(location.state.imageUpload || location.state.idImageUpload);
    setFile(uploadImage);
  }, [location]);

  // disable IconButton
  useEffect(() => {
    if (!uploadImage) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [location]);

  // scale
  const scaleHandler = (e) => {
    e.preventDefault();
    const w = document.getElementsByClassName('MuiSlider-track')[0].style.width;
    const newScale = 1 + w.split('%')[0] / 100;
    setScale(newScale);
  };

  // rotate
  const rotateHandler = (e) => {
    e.preventDefault();
    const w = document.getElementsByClassName('MuiSlider-track')[1].style.width;
    const newRotate = (w.split('%')[0] * 360) / 100;
    setRotate(newRotate);
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // eslint-disable-next-line no-plusplus
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const onClickSave = (e) => {
    setIsLoading(true);
    e.preventDefault();

    if (editor) {
      const canvas = editor.getImageScaledToCanvas().toDataURL('image/png');

      const theFile = dataURLtoFile(canvas, file.name);

      console.warn('editor --> ', typeof editor);
      console.warn('converted png --> ', canvas);
      console.warn('canvas type --> ', typeof canvas);
      console.warn('test png file --> ', theFile);
      console.warn('uploaded file --> ', file);

      // setThumb(canvas);
      setFinalImageFile(theFile);
      handleImageClose(); // close dialog

      setIsLoading(false);
    }
  };

  const setEditorRef = (thisEditor) => setEditor(thisEditor);

  return (
    <Grid container maxWidth="50%" sx={{ margin: 'auto  ' }}>
      <Grid item container justifyContent="space-between" alignItems="center">
        <IconButton onClick={handleImageClose}>
          <CloseIcon
            sx={{
              color: 'red',
              top: 0,
              right: 0,
              width: '24px',
              margin: '18px',
              zIndex: 10,
            }}
          />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            padding: 2,
            fontWeight: 'lighter',
            textAlign: 'center',
          }}
        >
          {t('image.edit')}
        </Typography>
        {isLoading ? (
          <CircularProgress
            size={20}
            sx={{
              top: 0,
              left: 0,
              width: '24px',
              margin: '18px',
              zIndex: 10,
            }}
          />
        ) : (
          <IconButton onClick={(e) => onClickSave(e)}>
            <DoneIcon
              sx={{
                color: isDisabled ? 'gray' : 'green',
                top: 0,
                left: 0,
                width: '24px',
                margin: '18px',
                zIndex: 10,
              }}
            />
          </IconButton>
        )}
      </Grid>
      <Grid container sx={{ margin: 2 }}>
        <div className="setting body-content flex-col al-center">
          <AvatarEditor
            image={file}
            width={window.innerWidth - 100}
            height={window.innerWidth - 100}
            ref={setEditorRef}
            border={50}
            borderRadius={customBorderRadius || 1000}
            scale={scale}
            rotate={rotate}
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          <Grid container sx={{ margin: 2 }}>
            <Typography variant="subtitle1" sx={{ margin: 'auto', marginLeft: 1, marginRight: 1 }}>
              {t('image.scale')}
            </Typography>
            <div className="flex-row" style={{ width: '100%' }}>
              <PrettySlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={0}
                onChange={scaleHandler}
                onClick={scaleHandler}
              />
            </div>
          </Grid>

          <Grid container sx={{ margin: 2 }}>
            <Typography variant="subtitle1" sx={{ margin: 'auto', marginLeft: 1, marginRight: 1 }}>
              {t('image.rotate')}
            </Typography>
            <div className="flex-row" style={{ width: '100%' }}>
              <PrettySlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                defaultValue={0}
                onChange={rotateHandler}
                onClick={rotateHandler}
              />
            </div>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
}
