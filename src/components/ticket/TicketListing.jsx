import React, { useEffect, useState } from 'react';
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
  Badge,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Scrollbar from '../custom-scroll/Scrollbar';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import { TicketSearch, selectTicket } from '../../redux/actions/ticketAction';
import { colorChoices, Colors } from '../../utils/types';

const filterTickets = (tickets, cSearch) => {
  if (tickets)
    return tickets.filter((t) => t.title.toLocaleLowerCase().includes(cSearch.toLocaleLowerCase()));
  return tickets;
};

const TicketListing = () => {
  const dispatch = useDispatch();

  const [sortedTickets, setSortedTickets] = useState();

  const myTickets = useSelector((state) => state.myTickets);
  const { currentTicket: activeTicket, tickets, ticketSearch } = myTickets;

  const ticketMsgAdd = useSelector((state) => state.ticketMsgAdd);
  const { socketContent } = ticketMsgAdd;

  const ticketById = useSelector((state) => state.ticketById);
  const { ticket: fetchedTicket } = ticketById;

  const ticketUpdate = useSelector((state) => state.ticketUpdate);
  const { updatedTicket } = ticketUpdate;

  useEffect(() => {
    if (tickets) {
      const filteredTickets = filterTickets(tickets, ticketSearch);
      filteredTickets.map((ticket) => {
        if (updatedTicket && ticket.id === updatedTicket.id) {
          const modifiedTicket = ticket;
          modifiedTicket.color = updatedTicket.color;
          return modifiedTicket;
        }
        return ticket;
      });
      setSortedTickets(
        filteredTickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      );
    }
  }, [ticketSearch, socketContent, tickets, updatedTicket]);

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
        {sortedTickets && (
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
                        (fetchedTicket &&
                          fetchedTicket.id === ticket.id &&
                          fetchedTicket.color === Colors.BLUE) ||
                        ticket.color === Colors.BLUE
                          ? colorChoices[0].code
                          : colorChoices[1].code,
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
                          <Badge
                            key={p.id}
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            // variant="dot"
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
                          </Badge>
                        ))}
                      </AvatarGroup>
                    </Grid>
                  </Stack>
                </Box>
                <Divider />
              </div>
            ))}
          </Scrollbar>
        )}
      </List>
    </div>
  );
};

export default TicketListing;
