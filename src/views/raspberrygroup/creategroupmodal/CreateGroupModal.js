import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { TextField } from '@mui/material'
import { useEffect, useRef } from 'react'

const CreateGroupModal = (props) => {
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current.focus(), 200)
  }, [])

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      props.saveGroup()
    }
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()}>
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Create new group</CModalTitle>
      </CModalHeader>
      <CModalBody onKeyDown={onKeyDown}>
        <TextField
          label="Name"
          variant="outlined"
          inputRef={inputRef}
          placeholder="Enter group name..."
          fullWidth={true}
          value={props.name}
          onChange={(e) => props.setName(e.target.value)}
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={props.saveGroup}>
          Save
        </CButton>
        <CButton color="secondary" onClick={() => props.onClose()}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default CreateGroupModal
