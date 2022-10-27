import React, { useEffect } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CoverCard from '../../components/profile/CoverCard';
import PhotosCard from '../../components/profile/PhotosCard';
import NewPost from '../../components/profile/NewPost';
import ImgPost from '../../components/profile/ImgPost';
import TypographyPost from '../../components/profile/TypographyPost';
import { fetchSwNeedList } from '../../redux/actions/needsAction';
import { fetchSwChildList } from '../../redux/actions/socialWorkerAction';
import { RolesEnum } from '../../utils/helpers';
import { fetchChildList } from '../../redux/actions/childrenAction';

const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'User Profile',
  },
];

const SocialWorkerProfile = () => {
  const dispatch = useDispatch();

  const swDetails = useSelector((state) => state.swDetails);
  const { swInfo } = swDetails;

  const swById = useSelector((state) => state.swById);
  const { children } = swById;

  const childAll = useSelector((state) => state.childAll);
  const { myChildren } = childAll;

  useEffect(() => {
    if (swInfo) {
      dispatch(fetchSwNeedList());
      if (swInfo.typeId === RolesEnum.ADMIN || swInfo.typeId === RolesEnum.SUPER_ADMIN) {
        dispatch(fetchChildList());
      } else {
        dispatch(fetchSwChildList(swInfo.id));
      }
    }
  }, [swInfo]);

  return (
    <PageContainer title="User Profile" description="this is User Profile page">
      {/* breadcrumb */}
      <Breadcrumb title="User Profile" items={BCrumb} />
      {/* end breadcrumb */}
      {swInfo && (children || myChildren) ? (
        <>
          <CoverCard swInfo={swInfo} />
          <Grid container spacing={0}>
            <Grid item sm={12} lg={4} xs={12}>
              {/* <IntroCard /> */}
              <PhotosCard myChildren={(children && children.children) || myChildren} />
            </Grid>
            <Grid item sm={12} lg={8} xs={12}>
              <NewPost />
              <ImgPost />
              <TypographyPost />
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid sx={{ textAlign: 'center' }}>
          <CircularProgress />
        </Grid>
      )}
    </PageContainer>
  );
};

export default SocialWorkerProfile;
