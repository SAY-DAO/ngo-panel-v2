import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';
/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */
const Login = Loadable(lazy(() => import('../pages/authentication/Login')));
const Error = Loadable(lazy(() => import('../pages/authentication/Error')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
const SocialWorkerList = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerList')));
const SocialWorkerEdit = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerEdit')));
const SocialWorkerAdd = Loadable(lazy(() => import('../pages/socialWorkers/SocialWorkerAdd')));
const SocialWorkerMigrate = Loadable(
  lazy(() => import('../pages/socialWorkers/SocialWorkerMigrate')),
);
const SocialWorkerProfile = Loadable(
  lazy(() => import('../pages/socialWorkers/SocialWorkerProfile')),
);
const NgoList = Loadable(lazy(() => import('../pages/ngos/NgoList')));
const NgoEdit = Loadable(lazy(() => import('../pages/ngos/NgoEdit')));
const NgoAdd = Loadable(lazy(() => import('../pages/ngos/NgoAdd')));
const ChildrenList = Loadable(lazy(() => import('../pages/children/ChildrenList')));
const ChildrenEdit = Loadable(lazy(() => import('../pages/children/ChildrenEdit')));
const ChildrenAdd = Loadable(lazy(() => import('../pages/children/ChildrenAdd')));
const NeedList = Loadable(lazy(() => import('../pages/needs/NeedList')));
const NeedEdit = Loadable(lazy(() => import('../pages/needs/NeedEdit')));
const NeedAdd = Loadable(lazy(() => import('../pages/needs/NeedAdd')));
/* ****Routes***** */

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboards/starter" /> },
      { path: '/dashboards/starter', exact: true, element: <Dashboard /> },
      { path: '/profile/view', exact: true, element: <SocialWorkerProfile /> },
      { path: '/profile/edit', exact: true, element: <SocialWorkerEdit /> },
      { path: '/sw/list', exact: true, element: <SocialWorkerList /> },
      { path: '/sw/edit/:id', exact: true, element: <SocialWorkerEdit /> },
      { path: '/sw/add', exact: true, element: <SocialWorkerAdd /> },
      { path: '/sw/migrate', exact: true, element: <SocialWorkerMigrate /> },
      { path: '/ngo/list', exact: true, element: <NgoList /> },
      { path: '/ngo/edit/:id', exact: true, element: <NgoEdit /> },
      { path: '/ngo/add', exact: true, element: <NgoAdd /> },
      { path: '/children/list', exact: true, element: <ChildrenList /> },
      { path: '/children/edit/:id', exact: true, element: <ChildrenEdit /> },
      { path: '/children/add', exact: true, element: <ChildrenAdd /> },
      { path: '/need/list', exact: true, element: <NeedList /> },
      { path: '/need/edit/:id', exact: true, element: <NeedEdit /> },
      { path: '/need/add', exact: true, element: <NeedAdd /> },
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
