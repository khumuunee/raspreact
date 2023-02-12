import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UploadSounds = React.lazy(() => import('./views/uploadsounds/UploadSounds'))
const AllSounds = React.lazy(() => import('./views/allsounds/AllSounds'))
const Playlist = React.lazy(() => import('./views/playlist/Playlist'))
const Raspberry = React.lazy(() => import('./views/raspberry/Raspberry'))
const ScheduledSounds = React.lazy(() => import('./views/scheduledsounds/ScheduledSounds'))
const RaspberryGroup = React.lazy(() => import('./views/raspberrygroup/RaspberryGroup'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  {
    path: '/uploadsounds',
    name: 'UploadSounds',
    element: UploadSounds,
  },
  {
    path: '/allsounds',
    name: 'AllSounds',
    element: AllSounds,
  },
  {
    path: '/playlist',
    name: 'Playlist',
    element: Playlist,
  },
  {
    path: '/raspberry',
    name: 'Raspberry',
    element: Raspberry,
  },
  {
    path: '/scheduledsounds',
    name: 'ScheduledSounds',
    element: ScheduledSounds,
  },
  {
    path: '/raspberrygroup',
    name: 'RaspberryGroup',
    element: RaspberryGroup,
  },
]

export default routes
