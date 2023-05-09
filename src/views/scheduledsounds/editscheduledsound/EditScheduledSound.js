import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { TextField } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { useEffect, useRef } from 'react'
import InputMask from 'react-input-mask'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import './editscheduledsound.scss'

const EditScheduledSound = (props) => {
  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      props.saveScheduledSound()
    }
  }

  return (
    <CModal
      visible={props.visible}
      alignment="center"
      onClose={() => props.onClose()}
      className="editscheduledsound"
    >
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Edit scheduled sound</CModalTitle>
      </CModalHeader>
      <CModalBody onKeyDown={onKeyDown}>
        <div style={{ marginBottom: '15px' }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              clearable
              ampm={false}
              label="Start time"
              value={props.startTime}
              onChange={props.setStartTime}
              renderInput={(params) => <TextField {...params} fullWidth={true} />}
            />
          </LocalizationProvider>
        </div>
        <div>
          <TextField
            label="Loop count"
            variant="outlined"
            placeholder="Enter loop count..."
            type="number"
            fullWidth={true}
            value={props.loopCount}
            onChange={(e) => props.setLoopCount(e.target.value)}
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="primary"
          //style={{ background: '#1976d2', borderColor: '#1976d2', color: 'white' }}
          onClick={props.saveScheduledSound}
        >
          Save
        </CButton>
        <CButton color="secondary" onClick={() => props.onClose()}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default EditScheduledSound
