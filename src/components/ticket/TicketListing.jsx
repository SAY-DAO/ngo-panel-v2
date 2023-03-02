import React, { useEffect } from 'react';
import {
  List,
  ListItemText,
  Divider,
  Box,
  Stack,
  Typography,
  Grid,
  AvatarGroup,
  Avatar,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Scrollbar from '../custom-scroll/Scrollbar';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { TicketSearch, selectTicket } from '../../redux/actions/ticketAction';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const filterTickets = (tickets, cSearch) => {
  if (tickets)
    return tickets.filter((t) => t.title.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()));
  return tickets;
};

const TicketListing = () => {
  const dispatch = useDispatch();

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket: activeTicket, tickets, ticketSearch } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { socketContent } = ticketMsgAdd;

  useEffect(() => {
    if (tickets) {
      filterTickets(tickets, ticketSearch);
    }
  }, [ticketSearch, socketContent, tickets]);

  const sortedTickets = tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div>
      <Box
        p={2}
        sx={{
          pt: '21px',
          pb: '21px',
        }}
      >
        <CustomTextField
          id="outlined-search"
          placeholder="Search contacts"
          size="small"
          type="search"
          variant="outlined"
          inputProps={{ 'aria-label': 'Search Contacts' }}
          fullWidth
          onChange={(e) => dispatch(TicketSearch(e.target.value))}
        />
      </Box>
      <Divider />
      <List sx={{ height: { lg: 'calc(100vh - 365px)', sm: '100vh' }, p: 1 }}>
        <Scrollbar>
          {sortedTickets.map((ticket) => (
            <div key={ticket.id}>
              <Box
                p={2}
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                  backgroundColor: activeTicket === ticket.id ? 'rgba(230,244,255,0.3)' : '',
                }}
                onClick={() => dispatch(selectTicket(ticket.id))}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '5px',
                    height: '100%',
                    left: 0,
                    top: 0,
                    backgroundColor:
                      ticket.color === 'secondary'
                        ? (theme) => theme.palette.secondary.main
                        : ticket.color === 'error'
                        ? (theme) => theme.palette.error.main
                        : ticket.color === 'warning'
                        ? (theme) => theme.palette.warning.main
                        : ticket.color === 'success'
                        ? (theme) => theme.palette.success.main
                        : ticket.color === 'primary'
                        ? (theme) => theme.palette.primary.main
                        : (theme) => theme.palette.primary.main,
                  }}
                />
                <Typography variant="h5" sx={{ width: '240px' }} noWrap>
                  {ticket.flaskNeedId} - {ticket.title}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <ListItemText
                    secondary={new Date(ticket.createdAt).toLocaleDateString({
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                    })}
                  />
                  <Grid>
                    <AvatarGroup max={4}>
                      {ticket.contributors.map((p) => (
                        <StyledBadge
                          key={p.id}
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          variant="dot"
                        >
                          <Avatar
                            alt={p.firstName}
                            src={p.avatarUrl}
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: (theme) => theme.palette.grey.A200,
                            }}
                          />
                        </StyledBadge>
                      ))}
                    </AvatarGroup>
                  </Grid>
                </Stack>
              </Box>
              <Divider />
            </div>
          ))}
        </Scrollbar>
      </List>
    </div>
  );
};

export default TicketListing;
