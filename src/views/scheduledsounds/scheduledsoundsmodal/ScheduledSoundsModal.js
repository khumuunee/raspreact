import {
  CButton,
  CCol,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { AccessAlarms, MusicNote, VolumeDown } from '@mui/icons-material'
import { Checkbox } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'

const ScheduledSoundsModal = (props) => {
  const [soundList, setSoundList] = useState([])
  const [selectedSoundList, setSelectedSoundList] = useState([])
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.visible) {
      getScheduledSounds()
      setSelectedSoundList([])
    }
  }, [props.visible])

  const getScheduledSounds = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getScheduledSounds')
      .then((res) => {
        handleResponse(res)
        if (res.data.soundList === 'empty') {
          setSoundList([])
        } else {
          let list = res.data.soundList.filter(
            (x) => props.soundList.filter((s) => s.soundName === x.name).length == 0,
          )
          list = list.sort(sortBy('name'))
          setSoundList(list)
        }
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickSound = (soundName) => {
    if (selectedSoundList.indexOf(soundName) > -1)
      setSelectedSoundList((prev) => prev.filter((x) => x !== soundName))
    else setSelectedSoundList((prev) => [...prev, soundName])
  }

  const handleSelectSoundChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedSoundList((prev) => [...prev, value])
    } else {
      setSelectedSoundList((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickSelectAll = () => {
    setSelectedSoundList(soundList.map((x) => x.name))
  }

  const onClickSave = () => {
    const selectedSounds = soundList.filter((x) => selectedSoundList.indexOf(x.name) > -1)
    props.addScheduledSoundsToGroup(selectedSounds)
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()} size="lg">
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Add scheduled sounds</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {soundList.length === 0 ? (
          <div>There is no sounds. Please upload scheduled sounds</div>
        ) : (
          <div>
            <CListGroup className="allitemsmodal-listGroup">
              {soundList.map((sound, idx) => (
                <CListGroupItem
                  key={idx}
                  component="button"
                  onClick={() => onClickSound(sound.name)}
                  className="allitemsmodal-listbutton"
                  active={selectedSoundList.indexOf(sound.name) > -1}
                >
                  <CRow>
                    <CCol xs="10">
                      <Checkbox
                        style={{ padding: '0px 10px 0px 1px' }}
                        value={sound.name}
                        onChange={handleSelectSoundChange}
                        checked={selectedSoundList.indexOf(sound.name) > -1}
                      />
                      {sound.name}
                    </CCol>
                    <CCol xs="2" style={{ textAlign: 'right' }}>
                      <AccessAlarms color="error" />
                    </CCol>
                  </CRow>
                </CListGroupItem>
              ))}
            </CListGroup>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CRow>
          <CCol xs="1">
            <CButton
              color="success"
              style={{ position: 'absolute', left: '15px' }}
              onClick={onClickSelectAll}
            >
              Select all
            </CButton>
          </CCol>
          <CCol xs="5" style={{ textAlign: 'right' }}>
            <CButton color="primary" onClick={onClickSave}>
              Save
            </CButton>
          </CCol>
          <CCol xs="2">
            <CButton color="secondary" onClick={() => props.onClose()}>
              Cancel
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  )
}

export default ScheduledSoundsModal
