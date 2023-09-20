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
  Fab,
  Grid,
  IconButton,
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
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { dateConvertor } from '../../utils/persianToEnglish';
import {
  deleteContribution,
  fetchAvailableContribution,
} from '../../redux/actions/blockchainAction';
import ContributionDialog from '../../components/dialogs/ContributionDialog';

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

export default function DaoContributionList() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contributionOpen, setContributionOpen] = useState(false);
  const [values, setValues] = useState({
    title: '',
    description: '',
  });
  const ecoContribution = useSelector((state) => state.ecoContribution);
  const { deleted, created, contributions } = ecoContribution;

  useEffect(() => {
    dispatch(fetchAvailableContribution());
  }, [created, deleted]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - contributions.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleAdd = () => {
    setContributionOpen(true);
  };
  return (
    <Grid container>
      <TableContainer component={Paper} sx={{ mt: 25 }}>
        {contributions && (
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">Description</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? contributions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : contributions
              ).map((c) => (
                <TableRow key={c.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
                      {c.title}
                    </Typography>
                  </TableCell>
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
                      {c.description}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">{dateConvertor(`${c.createdAt}`)}</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => dispatch(deleteContribution(c.id))}>
                      <CancelOutlinedIcon color="error" />
                    </IconButton>
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
                  count={contributions.length}
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
      <Grid container sx={{ mt: 3 }}>
        <Fab sx={{ m: 'auto' }} variant="extended" onClick={handleAdd}>
          <AddIcon sx={{ mr: 1 }} />
          {t('contribution.add')}
        </Fab>
      </Grid>
      <ContributionDialog
        open={contributionOpen}
        setOpen={setContributionOpen}
        values={values}
        setValues={setValues}
      />
    </Grid>
  );
}
