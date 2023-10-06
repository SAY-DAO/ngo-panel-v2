import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  CardMedia,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  TableFooter,
  TablePagination,
  Tooltip,
} from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import {
  deleteMidjourneyFolder,
  fetchMidjourneyImages,
  selectMidjourneyImage,
} from '../../redux/actions/midjourneyAction';
import { GET_ALL_MIDJOURNEY_IMAGES_RESET } from '../../redux/constants/midjourneyConstants';

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

export default function DaoMidJourneyList() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const midjourney = useSelector((state) => state.midjourney);
  const { selected, loading: loadingSelected, needsResult } = midjourney;

  useEffect(() => {
    dispatch(fetchMidjourneyImages(page, rowsPerPage));
    return () => {
      dispatch({ type: GET_ALL_MIDJOURNEY_IMAGES_RESET });
    };
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = (flaskNeedId) => {
    dispatch(deleteMidjourneyFolder(flaskNeedId));
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 25 }}>
      {needsResult && needsResult.list && needsResult.list[0] && (
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Need Id</TableCell>
              <TableCell align="center">Child Id</TableCell>
              <TableCell align="center">NGO Name</TableCell>
              <TableCell align="center">Family Ids</TableCell>
              <TableCell align="center">Original</TableCell>
              <TableCell align="center">Selected</TableCell>
              <TableCell align="center">Local Options</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {needsResult.list.map((need) => (
              <TableRow
                key={need.needFlaskId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{need.needFlaskId}</TableCell>
                <TableCell align="center">{need.childFlaskId}</TableCell>
                <TableCell align="center">{need.ngoName}</TableCell>
                <TableCell align="center">
                  {need.usersFlaskId.map(
                    (element, index) =>
                      `${element} ${index + 1 < need.usersFlaskId.length ? ',' : ''} `,
                  )}
                </TableCell>
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
                  {loadingSelected ? (
                    <CircularProgress />
                  ) : (
                    <Tooltip
                      arrow
                      title={
                        <>
                          <CardMedia
                            component="img"
                            image={
                              selected && selected.id === need.id
                                ? `${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${selected}`
                                : `${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.selectedImage}`
                            }
                            alt="large"
                            sx={{ width: '100%' }}
                          />
                        </>
                      }
                      placement="top"
                    >
                      <Avatar
                        alt="Remy Sharp"
                        src={
                          selected && selected.id === need.id
                            ? `${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${selected}`
                            : `${process.env.REACT_APP_GITHUB_IMAGE_SERVE}/${need.selectedImage}`
                        }
                      />
                    </Tooltip>
                  )}
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
                <TableCell>
                  <IconButton onClick={() => handleDelete(need.needFlaskId)}>
                    <HighlightOffRoundedIcon color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                colSpan={12}
                count={needsResult.total}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page',
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </TableContainer>
  );
}
