import React, { useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography, Button, Avatar } from '@mui/material';
import FeatherIcon from 'feather-icons-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import cover from '../../assets/images/cover.jpg';
import { fetchSocialWorkerById } from '../../redux/actions/socialWorkerAction';

const CoverCard = ({ swId }) => {
  const dispatch = useDispatch();

  const swProfile = useSelector((state) => state.swProfile);
  const { profile } = swProfile;

  const swById = useSelector((state) => state.swById);
  const { result } = swById;

  useEffect(() => {
    if (swId) {
      dispatch(fetchSocialWorkerById(swId));
    }
  }, [swId]);

  return (
    <Card
      sx={{
        padding: '0',
      }}
    >
      <img srcSet={`${cover} 1x, ${cover} 2x`} alt={cover} width="100%" />
      <CardContent
        sx={{
          pt: '24px',
          pb: '28px',
        }}
      >
        <Grid container spacing={0}>
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '2',
                sm: '2',
                lg: '1',
              },
            }}
          >
            <Grid
              container
              spacing={0}
              sx={{
                mt: {
                  xs: 1,
                },
                mb: {
                  xs: 1,
                },
              }}
            >
              <Grid
                item
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <FeatherIcon icon="file-text" width="20" />
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  {profile && profile.meta.totalItems}
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h5"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  Needs
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <FeatherIcon icon="user-check" width="20" />
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  3,586
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h5"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  Children
                </Typography>
              </Grid>
              <Grid
                item
                lg={4}
                sm={4}
                xs={4}
                sx={{
                  textAlign: 'center',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.grey.A200,
                  }}
                >
                  <FeatherIcon icon="users" width="20" />
                </Typography>
                <Typography
                  variant="h4"
                  fontWeight="600"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  2,659
                </Typography>
                <Typography
                  color="textSecondary"
                  variant="h5"
                  fontWeight="400"
                  sx={{
                    lineHeight: '1.2',
                  }}
                >
                  NGO
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* about profile */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            sx={{
              order: {
                xs: '1',
                sm: '1',
                lg: '2',
              },
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                mt: '-90px',
              }}
            >
              <Box>
                <Box
                  sx={{
                    backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
                    padding: '4px',
                    borderRadius: '50%',
                    border: (theme) =>
                      `${theme.palette.mode === 'dark' ? '3px solid #3c414c' : '3px solid #fff'}`,
                    width: '110px',
                    height: '110px',
                    overflow: 'hidden',
                    margin: '0 auto',
                  }}
                >
                  <Avatar
                    src={result && result.avatarUrl}
                    alt="Social worker avatar"
                    sx={{
                      borderRadius: '50%',
                      width: '96px',
                      height: '96px',
                      border: (theme) =>
                        `${theme.palette.mode === 'dark' ? '4px solid #3c414c' : '4px solid #fff'}`,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    mt: '5px',
                    display: 'block',
                  }}
                >
                  <Typography
                    fontWeight="500"
                    sx={{
                      fontSize: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {`${result && result.firstName} ${result && result.lastName}`}{' '}
                  </Typography>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="400"
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    {result && result.typeName}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          {/* friends following buttons */}
          <Grid
            item
            lg={4}
            sm={12}
            xs={12}
            display="flex"
            alignItems="center"
            sx={{
              justifyContent: {
                sm: 'center',
                lg: 'flex-end',
              },
              mt: {
                sm: 2,
                lg: 0,
              },
              ml: {
                sm: 4,
                lg: 0,
              },
              order: {
                xs: '3',
                sm: '3',
                lg: '3',
              },
            }}
          >
            <Box
              sx={{
                display: {
                  sm: 'flex',
                  lg: 'flex',
                  xs: 'block',
                },
                alignItems: 'center',
                justifyContent: 'flex-end',
                textAlign: {
                  xs: 'center',
                },
              }}
            >
              <Button
                disabled
                color="primary"
                variant="contained"
                size="small"
                sx={{
                  height: '40px',
                  backgroundColor: '#f4b58f',
                  pl: '18px',
                  pr: '18px',
                  ml: 1,
                  mt: {
                    xs: 1,
                    sm: 0,
                    lg: 0,
                  },
                }}
              >
                Connect Wallet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

CoverCard.propTypes = {
  swId: PropTypes.number,
};

export default CoverCard;
