import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';
import {
  CHILDREN_ADD,
  CHILDREN_EDIT,
  CHILDREN_LIST,
  DAO_HOME,
  HOME,
  MILESTONE_ADD,
  MILESTONE_LIST,
  NEED_ADD,
  NEED_EDIT,
  NEED_LIST,
  NGO_ADD,
  NGO_EDIT,
  NGO_LIST,
  PROFILE_EDIT,
  PROFILE_VIEW,
  PROVIDER_ADD,
  PROVIDER_EDIT,
  PROVIDER_LIST,
  REPORTS,
  SW_ADD,
  SW_EDIT,
  SW_LIST,
  SW_MIGRATE,
} from './RouteConstants';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Error = Loadable(lazy(() => import('../pages/authentication/Error')));

/* ****Pages***** */
const SocialWorkerList = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerList')));
const SocialWorkerEdit = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerEdit')));
const SocialWorkerAdd = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerAdd')));
const SocialWorkerMigrate = Loadable(
  lazy(() => import('../pages/socialWorkers/SocialWorkerMigrate')),
);
const SocialWorkerProfile = Loadable(lazy(() => import('../pages/my-profile/MyProfile')));
const ProviderList = Loadable(lazy(() => import('../pages/providers/ProviderList')));
const ProviderEdit = Loadable(lazy(() => import('../pages/providers/ProviderEdit')));
const ProviderAdd = Loadable(lazy(() => import('../pages/providers/ProviderAdd')));
const NgoList = Loadable(lazy(() => import('../pages/ngos/NgoList')));
const NgoEdit = Loadable(lazy(() => import('../pages/ngos/NgoEdit')));
const NgoAdd = Loadable(lazy(() => import('../pages/ngos/NgoAdd')));
const ChildrenList = Loadable(lazy(() => import('../pages/children/ChildrenList')));
const ChildrenEdit = Loadable(lazy(() => import('../pages/children/ChildrenEdit')));
const ChildrenAdd = Loadable(lazy(() => import('../pages/children/ChildrenAdd')));
const NeedList = Loadable(lazy(() => import('../pages/needs/NeedList')));
const NeedEdit = Loadable(lazy(() => import('../pages/needs/NeedEdit')));
const NeedAdd = Loadable(lazy(() => import('../pages/needs/NeedAdd')));
const ReportList = Loadable(lazy(() => import('../pages/reports/ReportStatus')));
const DAO = Loadable(lazy(() => import('../pages/dao/Dao')));
const DaoMileStoneAdd = Loadable(lazy(() => import('../pages/dao/DaoMileStoneAdd')));
const DaoMileStoneList = Loadable(lazy(() => import('../pages/dao/DaoMileStoneList')));

/* ****Routes***** */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: HOME, element: <Navigate to={PROFILE_VIEW} /> },
      { path: PROFILE_VIEW, exact: true, element: <SocialWorkerProfile /> },
      { path: PROFILE_EDIT, exact: true, element: <SocialWorkerEdit /> },
      { path: SW_LIST, exact: true, element: <SocialWorkerList /> },
      { path: SW_EDIT, exact: true, element: <SocialWorkerEdit /> },
      { path: SW_ADD, exact: true, element: <SocialWorkerAdd /> },
      { path: SW_MIGRATE, exact: true, element: <SocialWorkerMigrate /> },
      { path: PROVIDER_LIST, exact: true, element: <ProviderList /> },
      { path: PROVIDER_EDIT, exact: true, element: <ProviderEdit /> },
      { path: PROVIDER_ADD, exact: true, element: <ProviderAdd /> },
      { path: NGO_LIST, exact: true, element: <NgoList /> },
      { path: NGO_EDIT, exact: true, element: <NgoEdit /> },
      { path: NGO_ADD, exact: true, element: <NgoAdd /> },
      { path: CHILDREN_LIST, exact: true, element: <ChildrenList /> },
      { path: CHILDREN_EDIT, exact: true, element: <ChildrenEdit /> },
      { path: CHILDREN_ADD, exact: true, element: <ChildrenAdd /> },
      { path: NEED_LIST, exact: true, element: <NeedList /> },
      { path: NEED_EDIT, exact: true, element: <NeedEdit /> },
      { path: NEED_ADD, exact: true, element: <NeedAdd /> },
      { path: REPORTS, exact: true, element: <ReportList /> },
      { path: DAO_HOME, exact: true, element: <DAO /> },
      { path: MILESTONE_ADD, exact: true, element: <DaoMileStoneAdd /> },
      { path: MILESTONE_LIST, exact: true, element: <DaoMileStoneList /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
