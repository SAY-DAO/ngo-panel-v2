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
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  TableFooter,
  TablePagination,
  Typography,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { deleteComment, fetchComments, resolveComment } from '../../redux/actions/commentAction';
import { dateConvertor } from '../../utils/persianToEnglish';

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

export default function DaoCommentList() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [checked, setChecked] = useState(true);

  const commentResult = useSelector((state) => state.commentResult);
  const { resolveResult, deletedComment, needsWithComment } = commentResult;

  useEffect(() => {
    dispatch(fetchComments());
  }, [deletedComment]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - needsWithComment.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChange = (needId) => {
    dispatch(resolveComment(needId));
  };

  useEffect(() => {
    if (resolveResult) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [resolveResult]);

  return (
    <TableContainer component={Paper} sx={{ mt: 25 }}>
      {needsWithComment && (
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Flask Need Id</TableCell>
              <TableCell align="center">Need Name</TableCell>
              <TableCell align="center">Last Comment</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? needsWithComment.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : needsWithComment
            ).map((need) => (
              <TableRow
                key={need.flaskId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{need.flaskId}</TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '150px',
                      whiteSpace: 'nowrap',
                      pb: 2,
                      margin: 'auto',
                    }}
                  >
                    {need.title}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    sx={{
                      textAlign: 'center',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '200px',
                      whiteSpace: 'nowrap',
                      pb: 2,
                      margin: 'auto',
                    }}
                  >
                    {need.comments[need.comments.length - 1].content}
                  </Typography>
                </TableCell>
                <TableCell align="center">{dateConvertor(`${need.createdAt}`)}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() =>
                      dispatch(deleteComment(need.comments[need.comments.length - 1].id))
                    }
                  >
                    <CancelOutlinedIcon color="error" />
                  </IconButton>
                </TableCell>
                <TableCell align="center">
                  <FormControlLabel
                    control={<Switch onChange={() => handleChange(need.id)} checked={checked} />}
                    label="Label"
                  />
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={3}
                count={needsWithComment.length}
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
