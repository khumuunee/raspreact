import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AddCircle, FullscreenExit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkbox, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import AllScheduledSoundsModal from '../../raspberry/allscheduledsoundsmodal/AllScheduledSoundsModal'

const ListRaspberryGroupScheduledSound = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [scheduledSoundGroups, setscheduledSoundGroups] = useState([])
  const [selectedScheduledSoundGroups, setSelectedScheduledSoundGroups] = useState([])
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [showAllScheduledSoungGroupModal, setshowAllScheduledSoungGroupModal] = useState(false)
  const [currentRaspGroupName, setcurrentRaspGroupName] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showScheduledSound) loadRaspberryGroupScheduledSoundGroup()
    else setscheduledSoundGroups([])
    setSelectedScheduledSoundGroups([])
    setcurrentRaspGroupName(getSelectedRaspGroupName())
  }, [props.showScheduledSoundCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedScheduledSoundGroups.length == 0)
  }, [selectedScheduledSoundGroups])

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked)
      setSelectedScheduledSoundGroups(scheduledSoundGroups.map((x) => x.groupName))
    else setSelectedScheduledSoundGroups([])
  }

  const onClickAddScheduledSoundButton = () => {
    setshowAllScheduledSoungGroupModal(true)
  }

  const onClickDeleteButton = () => {
    mainContext.showModal(
      'Remove group - ' + currentRaspGroupName,
      'Are sure remove scheduled sound group from the Raspberry group?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const raspGroupId = getSelectedRaspGroupId()
    const groupIds = scheduledSoundGroups
      .filter((x) => selectedScheduledSoundGroups.indexOf(x.groupName) > -1)
      .map((x) => x.groupId)
    axiosInstance
      .post('/removeScheduledSoundGroupsFromRaspberryGroup', {
        groupIds: groupIds,
        raspGroupId: raspGroupId,
      })
      .then((res) => {
        handleResponse(res)
        setSelectedScheduledSoundGroups([])
        loadRaspberryGroupScheduledSoundGroup()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickSoundGroup = (groupName) => {
    if (selectedScheduledSoundGroups.indexOf(groupName) > -1)
      setSelectedScheduledSoundGroups((prev) => prev.filter((x) => x !== groupName))
    else setSelectedScheduledSoundGroups((prev) => [...prev, groupName])
  }

  const loadRaspberryGroupScheduledSoundGroup = () => {
    mainContext.setShowLoader(true)
    const raspGroupId = getSelectedRaspGroupId()
    axiosInstance
      .get('/loadRaspberryGroupScheduledSoundGroup/' + raspGroupId)
      .then((res) => {
        handleResponse(res)
        if (res.data.listGroup) {
          let list = res.data.listGroup
          list = list.sort(sortBy('groupName'))
          setscheduledSoundGroups(list)
        } else setscheduledSoundGroups([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const getSelectedRaspGroupId = () => {
    return getSelectedRaspGroup().id
  }
  const getSelectedRaspGroupName = () => {
    return getSelectedRaspGroup().name
  }
  const getSelectedRaspGroup = () => {
    return props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])]
  }

  const addScheduledSoundGroupToRaspberryGroup = (addedGroupIds) => {
    if (addedGroupIds.length == 0) {
      mainContext.showWarningToast('Please select the scheduled sound group')
      return
    }
    setshowAllScheduledSoungGroupModal(false)
    const raspGroupId = getSelectedRaspGroupId()
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addScheduledSoundGroupToRaspberryGroup', {
        raspGroupId: raspGroupId,
        addedGroupIds: addedGroupIds,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberryGroupScheduledSoundGroup()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickCollapseButton = () => {
    props.setshowScheduledSound(false)
  }

  return (
    <>
      <CContainer className="header control-title" style={{ background: '#f5ac6e' }}>
        <CRow>
          <CCol xs={6}>
            <CHeaderBrand>Scheduled sound</CHeaderBrand>
          </CCol>
          <CCol xs={6} style={{ textAlign: 'right' }}>
            <CHeaderBrand>{currentRaspGroupName}</CHeaderBrand>
          </CCol>
        </CRow>
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
            <IconButton color="success" onClick={onClickAddScheduledSoundButton}>
              <AddCircle />
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
          <CCol style={{ position: 'absolute', right: '0px' }}>
            <IconButton style={{ color: 'black' }} onClick={onClickCollapseButton}>
              <FullscreenExit />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {props.showScheduledSound ? (
        <>
          {scheduledSoundGroups.length === 0 ? (
            <div style={{ margin: '22px 0px 0px 21px' }}>
              There is no scheduled sound. Please add scheduled sound
            </div>
          ) : (
            <div>
              <CListGroup className="control-listGroup">
                {scheduledSoundGroups.map((soundGroup, idx) => (
                  <CListGroupItem
                    key={idx}
                    component="button"
                    onClick={() => onClickSoundGroup(soundGroup.groupName)}
                    active={selectedScheduledSoundGroups.indexOf(soundGroup.groupName) > -1}
                  >
                    <CRow>
                      <CCol xs="9">
                        <Checkbox
                          style={{ padding: '0px 10px 0px 1px' }}
                          value={soundGroup.groupName}
                          checked={selectedScheduledSoundGroups.indexOf(soundGroup.groupName) > -1}
                        />
                        {soundGroup.groupName}
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
            Click on the scheduled sound icon to view the scheduled sound group
          </div>
        </>
      )}
      {showAllScheduledSoungGroupModal && (
        <AllScheduledSoundsModal
          visible={showAllScheduledSoungGroupModal}
          onClose={() => setshowAllScheduledSoungGroupModal(false)}
          addScheduledSoundGroupToRaspberry={addScheduledSoundGroupToRaspberryGroup}
          scheduledSoundGroups={scheduledSoundGroups}
        />
      )}
    </>
  )
}

export default ListRaspberryGroupScheduledSound
