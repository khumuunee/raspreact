import React, { useContext } from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import MainContext from 'src/context/MainContext'
function MyQuestionModal() {
  const mainContext = useContext(MainContext)
  return (
    <CModal
      visible={mainContext.modal.visible}
      alignment="center"
      onClose={() => mainContext.onCloseModal()}
    >
      <CModalHeader onClose={() => mainContext.closeModal()}>
        <CModalTitle>{mainContext.modal.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{mainContext.modal.text}</CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={mainContext.onClickModalYesButton}>
          Yes
        </CButton>
        <CButton color="secondary" onClick={() => mainContext.closeModal()}>
          No
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default MyQuestionModal
