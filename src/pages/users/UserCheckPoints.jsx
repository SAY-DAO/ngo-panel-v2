/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/no-array-index-key */
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Chip,
  Stack,
  Skeleton,
  Pagination,
  Box,
  Tooltip,
  Divider,
  useTheme,
  CardActionArea,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { formatDistanceToNowStrict, format } from 'date-fns';
import { fetchCheckpoints } from '../../redux/actions/userAction';
import { prepareUrl } from '../../utils/helpers';

/* findLikelyArray helper (same as before) */
function findLikelyArray(obj, depth = 0, maxDepth = 4, visited = new WeakSet()) {
  if (!obj || typeof obj !== 'object' || visited.has(obj) || depth > maxDepth) return null;
  visited.add(obj);
  if (Array.isArray(obj)) {
    const candidates = obj.filter((it) => it && typeof it === 'object');
    if (candidates.length > 0) {
      const score = candidates.reduce((s, it) => {
        if (it.id) s += 2;
        if (it.title) s += 2;
        if (it.createdAt) s += 1;
        return s;
      }, 0);
      if (score / candidates.length > 0.2) return obj;
    }
  }
  for (const key of Object.keys(obj)) {
    try {
      const val = obj[key];
      const found = findLikelyArray(val, depth + 1, maxDepth, visited);
      if (found) return found;
    } catch (e) {
      // ignore
    }
  }
  return null;
}

export default function CheckpointsPage() {
  const dispatch = useDispatch();
  const theme = useTheme();

  const raw = useSelector((state) => state.userCheckPoints || {});

  const status = raw.status ?? raw.points?.status ?? raw.meta?.status ?? raw.fetchStatus ?? 'idle';
  const total = raw.total ?? raw.points?.total ?? raw.meta?.total ?? raw.count ?? 0;
  const page = raw.page ?? raw.points?.page ?? 1;
  const pageSize = raw.pageSize ?? raw.points?.pageSize ?? 9;
  const error = raw.error ?? raw.points?.error ?? null;

  const rawCandidates = [
    raw.items,
    raw.points?.items,
    raw.points?.data,
    raw.data,
    raw.payload,
    raw.results,
    raw.rows,
    raw.list,
  ];

  const normalizePossible = (val) => {
    if (!val) return null;
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') {
      if (Array.isArray(val.items)) return val.items;
      if (Array.isArray(val.data)) return val.data;
      const vals = Object.values(val);
      if (vals.length > 0 && vals.every((v) => typeof v === 'object')) return vals;
    }
    return null;
  };

  let items = [];
  for (const cand of rawCandidates) {
    const n = normalizePossible(cand);
    if (Array.isArray(n) && n.length > 0) {
      items = n;
      break;
    }
  }
  if (!items.length) {
    const found = findLikelyArray(raw) || findLikelyArray(raw.points || {});
    if (Array.isArray(found) && found.length > 0) items = found;
  }
  if (!items.length && Array.isArray(raw)) items = raw;

  useEffect(() => {
    dispatch(fetchCheckpoints({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const pageCount = Math.max(1, Math.ceil((total || 0) / (pageSize || 1)));
  const skeletonCount = useMemo(() => Array.from({ length: 6 }), []);

  const handleRefresh = () => dispatch(fetchCheckpoints({ page, pageSize }));
  const handlePageChange = (_ev, value) => dispatch(fetchCheckpoints({ page: value, pageSize }));

  const avatarFromUser = (user, fallback) => {
    if (!user) return null;
    if (user.avatarUrl) {
      if (user.avatarUrl.startsWith('http')) return user.avatarUrl;
      const base = process.env.REACT_APP_API_BASE || '';
      return `${base.replace(/\/$/, '')}/${user.avatarUrl.replace(/^\//, '')}`;
    }
    const name =
      `${user.firstName || ''} ${user.lastName || ''}`.trim() ||
      user.userName ||
      user.id ||
      fallback;
    const parts = name.split(/\s+/).filter(Boolean);
    const initials = (parts.shift()?.charAt(0) || '') + (parts.pop()?.charAt(0) || '');
    return initials.toUpperCase();
  };

  const displayName = (item) => {
    const u = item.user;
    if (u) {
      const full = `${(u.firstName || '').trim()} ${(u.lastName || '').trim()}`.trim();
      if (full) return full;
      if (u.userName) return u.userName;
    }
    return item.userName || item.userId || 'Unknown';
  };

  const chipBg = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'design':
        return theme.palette.primary.light;
      case 'branding':
        return theme.palette.secondary.light;
      default:
        return theme.palette.grey.A100;
    }
  };

  // Menu + action state
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuForId, setMenuForId] = useState(null);

  // new unified confirmation dialog state:
  // actionType: 'confirm' | 'delete' | null
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [actionTargetId, setActionTargetId] = useState(null);

  const [loadingMap, setLoadingMap] = useState({}); // { [id]: { deleting: bool, confirming: bool } }
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const openMenu = (event, id) => {
    setMenuAnchor(event.currentTarget);
    setMenuForId(id);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuForId(null);
  };

  // open confirmation dialog for a specific action
  const openActionDialog = (type, id) => {
    closeMenu();
    setActionType(type);
    setActionTargetId(id);
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setActionType(null);
    setActionTargetId(null);
  };

  const setLoading = (id, key, val) =>
    setLoadingMap((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [key]: val } }));

  // Called when user presses "Yes" in the confirmation dialog
  const handleActionConfirm = async () => {
    const id = actionTargetId;
    const type = actionType;
    if (!id || !type) {
      closeActionDialog();
      return;
    }

    try {
      if (type === 'confirm') setLoading(id, 'confirming', true);
      if (type === 'delete') setLoading(id, 'deleting', true);

      if (type === 'confirm') {
        // dispatch confirm thunk (adjust unwrap if using RTK)
        // await dispatch(confirmCheckpoint(id));
        setSnackbar({ open: true, message: 'Checkpoint confirmed', severity: 'success' });
      } else {
        // delete
        // await dispatch(deleteCheckpoint(id));
        setSnackbar({ open: true, message: 'Checkpoint deleted', severity: 'success' });
      }

      // refresh list after action
      dispatch(fetchCheckpoints({ page, pageSize }));
    } catch (err) {
      setSnackbar({
        open: true,
        message: (err && err.message) || `Failed to ${actionType} checkpoint`,
        severity: 'error',
      });
    } finally {
      if (type === 'confirm') setLoading(id, 'confirming', false);
      if (type === 'delete') setLoading(id, 'deleting', false);
      closeActionDialog();
    }
  };

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          theme.palette.mode === 'dark'
            ? `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`
            : 'linear-gradient(180deg, #f7f9fc 0%, #ffffff 100%)',
        pb: 6,
      }}
    >
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Checkpoints
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {total ?? 0} total
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} size="small" aria-label="refresh">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Loading */}
        {status === 'loading' && (
          <Grid container spacing={3}>
            {skeletonCount.map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card
                  sx={{
                    p: 1,
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ padding: 12 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Skeleton width="70%" sx={{ mt: 1 }} />
                    <Skeleton width="50%" />
                  </div>
                  <CardContent>
                    <Skeleton height={12} sx={{ mb: 1 }} />
                    <Skeleton height={12} width="85%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Error */}
        {status === 'failed' && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="error" sx={{ mb: 2 }}>
              {error || 'Failed to load checkpoints.'}
            </Typography>
            <IconButton onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Box>
        )}

        {/* Empty/no data at all */}
        {total === 0 && items.length === 0 && status !== 'loading' && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              No checkpoints
            </Typography>
            <Typography color="text.secondary">There are no checkpoints to display.</Typography>
          </Box>
        )}

        {/* List (renders regardless of status if items present) */}
        {items.length > 0 && (
          <>
            <Grid container spacing={3}>
              {items.map((cp) => {
                const { user } = cp;
                const avatarVal = avatarFromUser(user, cp.userName || cp.userId || 'U');
                const avatarIsUrl = !!(user && user.avatarUrl);
                const createdAt = cp.createdAt ? new Date(cp.createdAt) : null;
                const idKey = cp.id || cp._id || `${cp.title}-${Math.random()}`;
                const loadingState = loadingMap[cp.id] || {};

                return (
                  <Grid item xs={12} sm={6} md={4} key={idKey}>
                    <Card
                      elevation={2}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 160ms ease, box-shadow 160ms ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: theme.shadows[8],
                        },
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      {/* Header - not inside CardActionArea */}
                      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={avatarIsUrl ? prepareUrl(avatarVal) : undefined}
                          sx={{
                            width: 56,
                            height: 56,
                            fontWeight: 700,
                            bgcolor: theme.palette.primary.main,
                          }}
                        >
                          {!avatarIsUrl ? avatarVal : null}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Box
                              sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}
                            >
                              <Typography noWrap variant="subtitle1" sx={{ fontWeight: 800 }}>
                                {cp.title || 'Untitled checkpoint'}
                              </Typography>
                              <Chip
                                label={cp.type || '—'}
                                size="small"
                                sx={{
                                  bgcolor: chipBg(cp.type),
                                  color: theme.palette.getContrastText(chipBg(cp.type)),
                                  fontWeight: 700,
                                  ml: 1,
                                }}
                              />
                            </Box>

                            {/* IconButton moved outside CardActionArea */}
                            <Box>
                              <IconButton
                                size="small"
                                aria-label="more"
                                aria-controls={menuForId === cp.id ? 'checkpoint-menu' : undefined}
                                aria-haspopup="true"
                                onClick={(e) => openMenu(e, cp.id)}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            </Box>
                          </Stack>

                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                            {createdAt
                              ? `${format(createdAt, 'PP')} · ${formatDistanceToNowStrict(
                                  createdAt,
                                )} ago`
                              : 'No date'}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      {/* CardActionArea wraps only clickable content */}
                      <CardActionArea
                        onClick={() => {
                          /* optionally navigate */
                        }}
                        sx={{ alignItems: 'stretch', display: 'flex', flexDirection: 'column' }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 4,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {cp.description || 'No description.'}
                          </Typography>
                        </CardContent>

                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', p: 2, pt: 0 }}>
                          <Chip
                            label={cp.isConfirmed ? 'Confirmed' : 'Unconfirmed'}
                            size="small"
                            variant={cp.isConfirmed ? 'filled' : 'outlined'}
                            sx={{
                              borderRadius: 1,
                              px: 1,
                              bgcolor: cp.isConfirmed ? theme.palette.success.main : undefined,
                              color: cp.isConfirmed
                                ? theme.palette.success.contrastText
                                : undefined,
                            }}
                          />
                          <Chip
                            label={`User: ${displayName(cp)}`}
                            size="small"
                            variant="outlined"
                          />
                          <Box sx={{ flexGrow: 1 }} />
                        </Box>
                      </CardActionArea>
                    </Card>

                    {/* Menu anchored to the IconButton */}
                    <Menu
                      id="checkpoint-menu"
                      anchorEl={menuAnchor}
                      open={Boolean(menuAnchor) && menuForId === cp.id}
                      onClose={closeMenu}
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    >
                      <MenuItem
                        onClick={() => openActionDialog('confirm', cp.id)}
                        disabled={!!loadingState.confirming}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {loadingState.confirming ? <CircularProgress size={16} /> : null}
                        Confirm
                      </MenuItem>
                      <MenuItem
                        onClick={() => openActionDialog('delete', cp.id)}
                        disabled={!!loadingState.deleting}
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        {loadingState.deleting ? <CircularProgress size={16} /> : null}
                        Delete
                      </MenuItem>
                    </Menu>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pageCount}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Unified confirmation dialog for both confirm & delete */}
        <Dialog open={actionDialogOpen} onClose={closeActionDialog}>
          <DialogTitle>
            {actionType === 'delete' ? 'Delete checkpoint?' : 'Confirm checkpoint?'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {actionType === 'delete'
                ? 'Are you sure you want to permanently delete this checkpoint? This action cannot be undone.'
                : 'Are you sure you want to mark this checkpoint as confirmed?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeActionDialog}>No</Button>
            <Button
              onClick={handleActionConfirm}
              color={actionType === 'delete' ? 'error' : 'primary'}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
