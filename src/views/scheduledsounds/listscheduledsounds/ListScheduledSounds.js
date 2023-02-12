import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AccessAlarms, AddCircle, Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import EditScheduledSound from '../editscheduledsound/EditScheduledSound'
import ScheduledSoundsModal from '../scheduledsoundsmodal/ScheduledSoundsModal'

const ListScheduledSounds = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [soundList, setSoundList] = useState([])
  const [selectedSoundList, setSelectedSoundList] = useState([])
  const [showScheduledSoundsModal, setShowScheduledSoundsModal] = useState(false)
  const [showEditScheduledSound, setshowEditScheduledSound] = useState(false)
  const [startTime, setStartTime] = useState(null) //useState(dayjs('2020-01-01 9:00'))
  const [loopCount, setLoopCount] = useState(1)
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showSounds) loadScheduledSounds()
    else {
      setSoundList([])
    }
    setSelectedSoundList([])
  }, [props.showSoundsCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedSoundList.length == 0)
    setEditButtonDisabled(selectedSoundList.length != 1)
  }, [selectedSoundList])

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) setSelectedSoundList(soundList.map((s) => s.soundName))
    else setSelectedSoundList([])
  }

  const handleSelectSoundChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedSoundList((prev) => [...prev, value])
    } else {
      setSelectedSoundList((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickSound = (soundName) => {
    if (selectedSoundList.indexOf(soundName) > -1)
      setSelectedSoundList((prev) => prev.filter((x) => x !== soundName))
    else setSelectedSoundList((prev) => [...prev, soundName])
  }

  const loadScheduledSounds = () => {
    mainContext.setShowLoader(true)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    axiosInstance
      .get('/loadScheduledSounds/' + groupId)
      .then((res) => {
        handleResponse(res)
        if (res.data.listSound) {
          let list = res.data.listSound
          list = list.sort(sortBy('startTime', false))
          setSoundList(list)
        } else setSoundList([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickDeleteButton = () => {
    mainContext.showModal(
      'Remove sounds',
      'Are sure remove sounds from the group?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    axiosInstance
      .post('/removeSoundsFromGroup', { sounds: selectedSoundList, groupId: groupId })
      .then((res) => {
        handleResponse(res)
        if (res.data.listSound) {
          let list = res.data.listSound
          list = list.sort(sortBy('startTime', false))
          setSoundList(list)
        } else setSoundList([])
        setSelectedSoundList([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickAddSounds = () => {
    if (props.selectedGroup.length != 1) {
      mainContext.showWarningToast('Please select a group')
      return
    }
    setShowScheduledSoundsModal(true)
  }

  const onCloseScheduledSoundsModal = () => {
    setShowScheduledSoundsModal(false)
  }

  const addScheduledSoundsToGroup = (addedSoundList) => {
    if (addedSoundList.length == 0) {
      mainContext.showWarningToast('Please select the sounds')
      return
    }
    setShowScheduledSoundsModal(false)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addScheduledSoundsToGroup', {
        groupId: groupId,
        addedSoundList: addedSoundList,
        loopCount: 1,
        startTime: '12:00:00',
      })
      .then((res) => {
        handleResponse(res)
        loadScheduledSounds()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickEditButton = () => {
    setshowEditScheduledSound(true)
    const selectedSound = soundList.filter((x) => x.soundName === selectedSoundList[0])[0]
    setStartTime(dayjs('2020-01-01' + selectedSound.startTime))
    setLoopCount(selectedSound.loopCount)
  }

  const onCloseEditScheduledSound = () => {
    setshowEditScheduledSound(false)
  }

  const saveScheduledSound = () => {
    if (!startTime) {
      mainContext.showWarningToast('Please enter the start time')
      return
    }
    setshowEditScheduledSound(false)
    let hour = '' + startTime.$H
    if (hour.length === 1) hour = '0' + hour
    let minute = '' + startTime.$m
    if (minute.length === 1) minute = '0' + minute
    const time = hour + ':' + minute + ':00'
    const selectedSound = soundList.filter((x) => x.soundName === selectedSoundList[0])[0]
    const selectedSoundIndex = soundList.indexOf(selectedSound)
    if (time === selectedSound.startTime && loopCount === selectedSound.loopCount) {
      console.log('no change found')
      return
    }
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/editScheduledSound', {
        selectedSound: selectedSound,
        loopCount: loopCount,
        startTime: time,
      })
      .then((res) => {
        handleResponse(res)
        selectedSound.startTime = time
        selectedSound.loopCount = loopCount
        soundList[selectedSoundIndex] = selectedSound
        let list = soundList.sort(sortBy('startTime', false))
        setSoundList(list)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  return (
    <div>
      <CContainer className="header control-title">
        <CHeaderBrand>Scheduled sounds</CHeaderBrand>
      </CContainer>
      <CContainer className="header control-header">
        <CRow xs={{ cols: 'auto' }}>
          <CCol>
            <Checkbox
              label="Select all"
              checked={selectAll}
              onChange={handleSelectAllChange}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </CCol>
          <CCol>
            <IconButton color="success" onClick={onClickAddSounds} disabled={!props.showSounds}>
              <AddCircle />
            </IconButton>
          </CCol>
          <CCol>
            <IconButton
              style={editButtonDisabled ? { color: 'grey' } : { color: '#ff7043' }}
              disabled={editButtonDisabled}
              aria-label="edit"
              onClick={onClickEditButton}
            >
              <Edit />
            </IconButton>
          </CCol>
          <CCol>
            <IconButton
              color="primary"
              disabled={deleteButtonDisabled}
              onClick={onClickDeleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {props.showSounds ? (
        <>
          {soundList.length === 0 ? (
            <div style={{ margin: '22px 0px 0px 21px' }}>There is no sounds. Please add sounds</div>
          ) : (
            <div>
              <CListGroup className="control-listGroup">
                {soundList.map((sound, idx) => (
                  <CListGroupItem
                    key={idx}
                    component="button"
                    onClick={() => onClickSound(sound.soundName)}
                    active={selectedSoundList.indexOf(sound.soundName) > -1}
                  >
                    <CRow>
                      <CCol xs="8">
                        <Checkbox
                          style={{ padding: '0px 10px 0px 1px' }}
                          value={sound.soundName}
                          onChange={handleSelectSoundChange}
                          checked={selectedSoundList.indexOf(sound.soundName) > -1}
                        />
                        {sound.soundName}
                      </CCol>
                      <CCol xs="2">{sound.startTime}</CCol>
                      <CCol xs="1">{sound.loopCount}</CCol>
                      <CCol xs="1">
                        <AccessAlarms color="error" />
                      </CCol>
                    </CRow>
                  </CListGroupItem>
                ))}
              </CListGroup>
            </div>
          )}
        </>
      ) : (
        <>
          <div style={{ margin: '22px 0px 0px 21px' }}>
            Click on the arrow icon to view the sounds
          </div>
        </>
      )}
      {showScheduledSoundsModal && (
        <ScheduledSoundsModal
          visible={showScheduledSoundsModal}
          onClose={onCloseScheduledSoundsModal}
          addScheduledSoundsToGroup={addScheduledSoundsToGroup}
          soundList={soundList}
        />
      )}
      {showEditScheduledSound && (
        <EditScheduledSound
          visible={showEditScheduledSound}
          onClose={onCloseEditScheduledSound}
          saveScheduledSound={saveScheduledSound}
          startTime={startTime}
          setStartTime={setStartTime}
          loopCount={loopCount}
          setLoopCount={setLoopCount}
        />
      )}
    </div>
  )
}

export default ListScheduledSounds
