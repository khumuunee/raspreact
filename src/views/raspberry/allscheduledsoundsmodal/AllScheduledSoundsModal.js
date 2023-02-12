import {
  CButton,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { Checkbox } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'

const AllScheduledSoundsModal = (props) => {
  const [scheduledSoundGroups, setscheduledSoundGroups] = useState([])
  const [selectedScheduledSoundGroups, setSelectedScheduledSoundGroups] = useState([])
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.visible) {
      getAllScheduledSoundGroups()
      setSelectedScheduledSoundGroups([])
    }
  }, [props.visible])

  const getAllScheduledSoundGroups = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getAllScheduledSoundGroups')
      .then((res) => {
        handleResponse(res)
        if (res.data.scheduledSoundGroups === 'empty') setscheduledSoundGroups([])
        else {
          let list = res.data.scheduledSoundGroups.filter(
            (x) => props.scheduledSoundGroups.filter((s) => s.groupName === x.name).length == 0,
          )
          list = list.sort(sortBy('name'))
          setscheduledSoundGroups(list)
        }
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickScheduledSoundGroup = (name) => {
    if (selectedScheduledSoundGroups.indexOf(name) > -1)
      setSelectedScheduledSoundGroups((prev) => prev.filter((x) => x !== name))
    else setSelectedScheduledSoundGroups((prev) => [...prev, name])
  }

  const handleSelectScheduledSoundGroupChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedScheduledSoundGroups((prev) => [...prev, value])
    } else {
      setSelectedScheduledSoundGroups((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickSaveButton = () => {
    const groupIds = scheduledSoundGroups
      .filter((x) => selectedScheduledSoundGroups.indexOf(x.name) > -1)
      .map((x) => x.id)
    props.addScheduledSoundGroupToRaspberry(groupIds)
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()} size="lg">
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Add scheduled sound group</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {scheduledSoundGroups.length === 0 ? (
          <div>There is no scheduled sound group. Please create scheduled sound group</div>
        ) : (
          <div>
            <CListGroup className="allitemsmodal-listGroup">
              {scheduledSoundGroups.map((soundGroup, idx) => (
                <CListGroupItem
                  key={idx}
                  component="button"
                  onClick={() => onClickScheduledSoundGroup(soundGroup.name)}
                  className="allitemsmodal-listbutton"
                  active={selectedScheduledSoundGroups.indexOf(soundGroup.name) > -1}
                >
                  <Checkbox
                    style={{ padding: '0px 10px 0px 1px' }}
                    value={soundGroup.name}
                    onChange={handleSelectScheduledSoundGroupChange}
                    checked={selectedScheduledSoundGroups.indexOf(soundGroup.name) > -1}
                  />
                  {soundGroup.name}
                </CListGroupItem>
              ))}
            </CListGroup>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={onClickSaveButton}>
          Save
        </CButton>
        <CButton color="secondary" onClick={() => props.onClose()}>
          Cancel
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default AllScheduledSoundsModal
