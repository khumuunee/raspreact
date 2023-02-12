import {
  cilCloudUpload,
  cibSoundcloud,
  cilSpeedometer,
  cilFeaturedPlaylist,
  cibRaspberryPi,
  cilAlarm,
  cilObjectGroup,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavTitle,
    name: 'Audio',
  },
  {
    component: CNavItem,
    name: 'Upload sounds',
    to: '/uploadsounds',
    icon: <CIcon icon={cilCloudUpload} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'All sounds',
    to: '/allsounds',
    icon: <CIcon icon={cibSoundcloud} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Playlist',
    to: '/playlist',
    icon: <CIcon icon={cilFeaturedPlaylist} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Scheduled sounds',
    to: '/scheduledsounds',
    icon: <CIcon icon={cilAlarm} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Node',
  },
  {
    component: CNavItem,
    name: 'Raspberry',
    to: '/raspberry',
    icon: <CIcon icon={cibRaspberryPi} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Raspberry Group',
    to: '/raspberrygroup',
    icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavGroup,
  //   name: 'Tables',
  //   to: '/blockmodeltable',
  //   icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Block model 1',
  //       to: '/blockmodeltable/table/1',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Block model 2',
  //       to: '/blockmodeltable/table/2',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Block model 3',
  //       to: '/blockmodeltable/table/3',
  //     },
  //   ],
  // },
  // {
  //   component: CNavTitle,
  //   name: '3d block model',
  // },
]

export default _nav
