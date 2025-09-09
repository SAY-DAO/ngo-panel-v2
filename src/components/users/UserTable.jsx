/* eslint-disable react/prop-types */
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { CardActionArea, Typography } from '@mui/material';
import { prepareUrl } from '../../utils/helpers';

export default function UserTable({ data, setDialogValues }) {
  const handleDialog = (u) => {
    setDialogValues({
      flaskUserId: u.id,
      open: true,
    });
  };
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {data.map((u) => (
        <CardActionArea onClick={() => handleDialog(u)} key={u.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={prepareUrl(u.avatarUrl)} />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  {u.firstName} {u.lastName}
                </>
              }
              secondary={<>{u.userName}</>}
            />
            <Typography sx={{ fontWeight: 200 }}>{u.id}</Typography>
          </ListItem>
          <Divider variant="inset" component="li" />
        </CardActionArea>
      ))}
    </List>
  );
}
