import React, { useCallback, useEffect, useState } from 'react';
import '../../resources/styles/css/search-user.css';
import { useDispatch, useSelector } from 'react-redux';

// MUI
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import UserDialog from '../../components/dialogs/UserDialog';
import { searchUser } from '../../redux/actions/userAction';
import UserTable from '../../components/users/UserTable';

export default function UserSearch() {
  const dispatch = useDispatch();

  const [query, setQuery] = useState('');
  const [dialogValues, setDialogValues] = useState(null);

  // same redux selector (logic unchanged)
  const result = useSelector((state) => state.userSearch?.result);

  const handleChange = useCallback((e) => {
    setQuery(e.target.value.toLowerCase());
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  useEffect(() => {
    // keep original behaviour: only dispatch when query is empty or length > 2
    if (query.length === 0 || query.length > 2) {
      dispatch(searchUser(query));
    }
  }, [dispatch, query]);

  const users = result?.users ?? [];
  const isSearching = query.length > 0 && !result;

  return (
    <Container maxWidth="lg" className="app user-main">
      <Box display="flex" flexDirection="column" gap={2} py={3}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              id="user-search"
              fullWidth
              placeholder="Search by name, email or id..."
              value={query}
              onChange={handleChange}
              variant="outlined"
              size="small"
              aria-label="Search users"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {query && (
                      <IconButton aria-label="Clear search" onClick={clearSearch} size="small">
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
            />

            <Box minWidth={120} textAlign="right">
              {isSearching ? (
                <Box display="flex" alignItems="center" gap={1} justifyContent="flex-end">
                  <CircularProgress size={18} />
                  <Typography variant="body2">Searching…</Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {query
                    ? `${users.length} result${users.length === 1 ? '' : 's'}`
                    : result
                    ? `${users.length} user${users.length === 1 ? '' : 's'}`
                    : 'Enter a search'}
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>

        <Box>
          {result ? (
            users.length > 0 ? (
              <Paper elevation={1} sx={{ p: 1 }} className="user-table-card">
                <UserTable setDialogValues={setDialogValues} data={users} />
              </Paper>
            ) : (
              <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }} className="user-empty-state">
                <Typography>
                  No users to show. Try a different search or clear the filter.
                </Typography>
              </Paper>
            )
          ) : (
            <Paper elevation={0} sx={{ p: 6, textAlign: 'center' }} className="user-placeholder">
              <Typography>Enter a search above to find users.</Typography>
            </Paper>
          )}
        </Box>
      </Box>

      {dialogValues && dialogValues.open && dialogValues.flaskUserId && (
        <UserDialog setDialogValues={setDialogValues} dialogValues={dialogValues} />
      )}
    </Container>
  );
}
