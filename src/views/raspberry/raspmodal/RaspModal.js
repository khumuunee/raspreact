import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { TextField } from '@mui/material'
import { useEffect, useRef } from 'react'
import InputMask from 'react-input-mask'

const RaspModal = (props) => {
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      console.log('RaspModal useEffect')
      if (inputRef && inputRef.current) {
        console.log('focus')
        inputRef.current.focus()
      } else {
        console.log('not focus')
      }
    }, 300)
  }, [])

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      props.saveRasp()
    }
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()}>
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Create new Raspberry</CModalTitle>
      </CModalHeader>
      <CModalBody onKeyDown={onKeyDown}>
        <div style={{ marginBottom: '15px' }}>
          <TextField
            label="Name"
            variant="outlined"
            placeholder="Enter raspberry name..."
            fullWidth={true}
            inputRef={inputRef}
            value={props.raspName}
            onChange={(e) => props.setraspName(e.target.value)}
          />
        </div>
        <div>
          <InputMask
            mask="999.999.999.999"
            maskChar="0"
            value={props.raspIpAddress}
            onChange={(e) => props.setraspIpAddress(e.target.value)}
          >
            {() => (
              <TextField
                fullWidth={true}
                placeholder="Enter raspberry ip address..."
                variant="outlined"
                label="Ip address"
              />
            )}
          </InputMask>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={props.saveRasp}>
          Save
        </CButton>
        <CButton color="secondary" onClick={() => props.onClose()}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default RaspModal
