import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  CardMedia,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchMidjourneyImages, selectMidjourneyImage } from '../../redux/actions/midjourneyAction';

export default function DenseTable() {
  const dispatch = useDispatch();

  const midjourney = useSelector((state) => state.midjourney);
  const { needs } = midjourney;

  useEffect(() => {
    dispatch(fetchMidjourneyImages());
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 25 }}>
      {needs && (
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Flask Id</TableCell>
              <TableCell align="center">Original</TableCell>
              <TableCell align="center">Selected</TableCell>
              <TableCell align="center">Local Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {needs.map((need) => (
              <TableRow
                key={need.needFlaskId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{need.needFlaskId}</TableCell>
                <TableCell align="center">
                  <Tooltip
                    arrow
                    title={
                      <>
                        <CardMedia
                          component="img"
                          image={need.originalImage}
                          alt="large"
                          sx={{ width: '100%' }}
                        />
                      </>
                    }
                    placement="top"
                  >
                    <Avatar alt="Remy Sharp" src={need.originalImage} />
                  </Tooltip>
                </TableCell>
                <TableCell align="center">
                  <Tooltip
                    arrow
                    title={
                      <>
                        <CardMedia
                          component="img"
                          image={`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.selectedImage}`}
                          alt="large"
                          sx={{ width: '100%' }}
                        />
                      </>
                    }
                    placement="top"
                  >
                    <Avatar
                      alt="Remy Sharp"
                      src={`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.selectedImage}`}
                    />
                  </Tooltip>
                </TableCell>
                <TableCell component="th" scope="row">
                  <AvatarGroup>
                    {[0, 1, 2, 3].map((link, index) => (
                      <PopupState key={link} variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <>
                            <Tooltip
                              arrow
                              title={
                                <>
                                  <CardMedia
                                    component="img"
                                    image={`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/need-${
                                      need.needFlaskId
                                    }/${need.needFlaskId}_${index + 1}.png`}
                                    alt="large"
                                    sx={{ width: '100%' }}
                                  />
                                </>
                              }
                              placement="top"
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
                                      alt="midjourney image"
                                      src={`${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/need-${
                                        need.needFlaskId
                                      }/${need.needFlaskId}_${index + 1}.png`}
                                    />
                                  </IconButton>
                                  <Menu {...bindMenu(popupState)}>
                                    <MenuItem
                                      onClick={() =>
                                        dispatch(
                                          selectMidjourneyImage(
                                            need.needFlaskId,
                                            `need-${need.needFlaskId}/${need.needFlaskId}_${
                                              index + 1
                                            }.png`,
                                          ),
                                        )
                                      }
                                    >
                                      Select
                                    </MenuItem>
                                  </Menu>
                                </>
                              </Box>
                            </Tooltip>
                          </>
                        )}
                      </PopupState>
                    ))}
                  </AvatarGroup>
                </TableCell>
                <TableCell component="th" scope="row">
                  <div className="upload__image-wrapper">
                    <Grid
                      sx={{
                        position: 'relative',
                      }}
                    >
                      <label htmlFor="upload-image-provider">
                        <input
                          accept="image/*"
                          id="upload-image-provider"
                          type="file"
                          style={{ display: 'none' }}
                          // onChange={onImageChange}
                        />

                        <IconButton
                          name="upload-image-provider"
                          id="upload-image-provider"
                          color="primary"
                          component="div"
                          sx={{
                            position: 'absolute',
                            bottom: '0px',
                            right: '0px',
                          }}
                        >
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
}
