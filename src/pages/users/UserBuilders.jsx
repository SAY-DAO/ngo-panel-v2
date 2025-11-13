/* eslint-disable react/no-array-index-key */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';
import { fetchBuilders } from '../../redux/actions/userAction';
import { prepareUrl } from '../../utils/helpers';

const UserBuilders = () => {
  const dispatch = useDispatch();
  const { builders, error, loading } = useSelector((s) => s.userBuilderStatus || {});

  // Fetch once on mount
  useEffect(() => {
    dispatch(fetchBuilders());
  }, [dispatch]);

  // Normalize and prepare list (robust to many API shapes)
  const users = useMemo(() => {
    const src = builders;

    if (!src) return [];

    let arr = [];
    if (Array.isArray(src)) arr = src;
    else if (Array.isArray(src.items)) arr = src.items;
    else if (Array.isArray(src.list)) arr = src.list;
    else if (Array.isArray(src.data)) arr = src.data;
    else arr = [];

    // map -> normalized shape
    const mapped = arr
      .map((r) => {
        if (!r || typeof r !== 'object') return null;
        const { id } = r;
        const name = r.firstName || '';
        const userName = r.userName || '';
        const avatar = prepareUrl(r.avatarUrl) || '';
        const { isBuilder } = r;
        const { createdAt } = r;
        return { id, name, userName, avatar, isBuilder, createdAt, raw: r };
      })
      .filter(Boolean);

    // dedupe by id (keep first)
    const seen = new Set();
    const deduped = [];
    for (const u of mapped) {
      console.log(u);

      if (!u) continue;
      if (seen.has(u.id)) continue;
      seen.add(u.id);
      deduped.push(u);
    }

    // stable sort by name (empty names at end)
    deduped.sort((a, b) => {
      if (!a.name && !b.name) return 0;
      if (!a.name) return 1;
      if (!b.name) return -1;
      return a.name.localeCompare(b.name);
    });

    return deduped;
  }, [builders]);

  // Render skeleton placeholders while loading (nice for UX)
  const placeholders = Array.from({ length: 8 }).map((_, i) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={`ph-${i}`}>
      <Card variant="outlined" sx={{ minHeight: 88 }}>
        <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Skeleton variant="circular" width={48} height={48} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="60%" height={20} />
            <Skeleton width="90%" height={14} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </Alert>
      )}

      <Grid container spacing={2} alignItems="stretch">
        {loading && placeholders}

        {!loading && users.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              No users found.
            </Typography>
          </Grid>
        )}

        {!loading &&
          users.map((u) => (
            <Grid item key={u.id} xs={12} sm={6} md={4} lg={4}>
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
                aria-label={`user-${u.name || u.userName || u.id}`}
              >
                <CardContent sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar
                    src={u.avatar}
                    alt={u.name || u.userName}
                    sx={{ width: 56, height: 56, flexShrink: 0 }}
                  >
                    {!u.avatar && (u.name ? u.name[0] : '?')}
                  </Avatar>

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap>
                      {u.name || '—'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {u.userName || '—'}
                    </Typography>
                    {u.isBuilder && (
                      <Box sx={{ mt: 0.5 }}>
                        <Chip label="Builder" size="medium" color="primary" />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ textAlign: 'right', ml: 1 }}>
                    {u.createdAt ? (
                      <Typography variant="caption" color="text.secondary">
                        {(() => {
                          try {
                            return new Date(u.createdAt).toLocaleDateString();
                          } catch {
                            return '';
                          }
                        })()}
                      </Typography>
                    ) : null}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default UserBuilders;
