import React, { useContext } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'

import { CBadge } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilReload, cilSpeedometer } from '@coreui/icons'
import MainContext from 'src/context/MainContext'

export const AppSidebarNav = ({ items }) => {
  const mainContext = useContext(MainContext)
  const location = useLocation()
  const onClickRefreshDashboard = () => {
    mainContext.setStatusCounter(-2)
  }
  const navLink = (name, icon, badge, refreshButton) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
        {refreshButton && (
          <CIcon
            icon={cilReload}
            onClick={onClickRefreshDashboard}
            style={{ position: 'relative', left: '50px' }}
            customClassName="nav-icon"
          />
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, refreshButton, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge, refreshButton)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
