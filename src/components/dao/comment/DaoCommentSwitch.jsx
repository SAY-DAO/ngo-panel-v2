import * as React from 'react';
import Switch from '@mui/material/Switch';
import { FormControlLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { resolveComment } from '../../../redux/actions/commentAction';

export default function DaoCommentSwitch({ needId, resolved }) {
  const dispatch = useDispatch();

  const commentResult = useSelector((state) => state.commentResult);
  const { resolveResult } = commentResult;

  const [checked, setChecked] = useState(resolved);

  useEffect(() => {
    if (resolveResult && resolveResult.needId === needId) {
      console.log(resolveResult);
      if (resolveResult.isResolved) {
        setChecked(true);
      } else {
        setChecked(false);
      }
    }
  }, [resolveResult]);

  const handleChange = () => {
    dispatch(resolveComment(needId));
  };

  return (
    <FormControlLabel
      control={<Switch onChange={() => handleChange()} checked={checked} />}
      label={checked ? 'Yes' : 'No'}
    />
  );
}

DaoCommentSwitch.propTypes = {
  needId: PropTypes.string,
  resolved: PropTypes.bool,
};
