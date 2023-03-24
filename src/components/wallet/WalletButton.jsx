import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material';
import React from 'react';

const WalletButton = styled((props) => <LoadingButton {...props} {...props.register} />)(() => ({
  color: 'white',
  fontWeight: 'bold',
  fontSize: '14px',
  textAlign: 'center',
  textDecoration: 'none',
  // backgroundColor: '#ffa12b',
  display: 'block',
  position: 'relative',
  padding: '8px 20px',
  WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
  textShadow: '0px 1px 1px #000',
  filter: 'dropshadow(color=#000, offx=0px, offy=1px)',
  // WebkitBoxShadow: 'inset 0 1px 0 #ffe5c4, 0 10px 0 #915100',
  // MozBoxShadow: 'inset 0 1px 0 #ffe5c4, 0 10px 0 #915100',
  // boxShadow: 'inset 0 1px 0 #ffe5c4, 0 10px 0 #915100',
  // WebkitBorderRadius: '5px',
  // MozBorderRadius: '5px',
  // borderRadius: '5px',
  '&:active': {
    top: '5px',
    // backgroundColor: '#f78900',
    WebkitBoxShadow: 'inset 0 1px 0 #ffe5c4, inset 0 -3px 0 #915100',
    MozBoxShadow: 'inset 0 1px 0 #ffe5c4, inset 0 -3pxpx 0 #915100',
    boxShadow: 'inset 0 1px 0 #ffe5c4, inset 0 -3px 0 #915100',
  },
  '&:after': {
    height: '100%',
    width: '100%',
    padding: '4px',
    position: 'absolute',
    bottom: '-15px',
    left: '-4px',
    zIndex: -1,
    backgroundColor: '#2b1800',
    WebkitBorderRadius: '5px',
    MozBorderRadius: '5px',
    borderRadius: '5px',
  },
  '&:hover': {
    // backgroundColor: '#f78900',
    WebkitBoxShadow: 'inset 0 1px 0 #ffe5c4, 0 5px 0 #915100',
    MozBoxShadow: 'inset 0 1px 0 #ffe5c4, 0 5px 0 #915100',
    boxShadow: 'inset 0 1px 0 #ffe5c4, 0 5px 0 #915100',
  },
}));

export default WalletButton;
