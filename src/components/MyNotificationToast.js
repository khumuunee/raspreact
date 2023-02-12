import React, { useContext } from 'react'
import { CContainer, CSpinner, CToast, CToastBody, CToastHeader } from '@coreui/react'
import MainContext from 'src/context/MainContext'

function MyNotificationToast() {
  const mainContext = useContext(MainContext)
  return (
    <CToast
      autohide={mainContext.toast.autohide}
      visible={mainContext.toast.visible}
      style={{
        position: 'fixed',
        right: '10px',
        // top: '80px',
        bottom: '20px',
        zIndex: '99999',
        // overflow: 'hidden',
      }}
      delay={4000}
      onClose={mainContext.closeToast}
    >
      <CToastHeader closeButton>
        <svg
          className="rounded me-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          role="img"
        >
          <rect width="100%" height="100%" fill={mainContext.toast.color}></rect>
        </svg>
        <strong className="me-auto">Notification</strong>
        {/* <small>7 min ago</small> */}
      </CToastHeader>
      <CToastBody>{mainContext.toast.message}</CToastBody>
    </CToast>
  )
}

export default MyNotificationToast
