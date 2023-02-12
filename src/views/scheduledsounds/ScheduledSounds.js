import { CCol, CContainer, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ListGroup from './listgroup/ListGroup'
import ListScheduledSounds from './listscheduledsounds/ListScheduledSounds'

const ScheduledSounds = () => {
  const [showSounds, setShowSounds] = useState(false)
  const [showSoundsCounter, setShowSoundsCounter] = useState(0)
  const [grouplist, setGrouplist] = useState([])
  const [selectedGroup, setSelectedGroup] = useState([])

  useEffect(() => {
    if (selectedGroup.length != 1) setShowSounds(false)
  }, [selectedGroup])

  const onClickViewButton = () => {
    setShowSounds(true)
    setShowSoundsCounter(showSoundsCounter === 1000 ? 0 : showSoundsCounter + 1)
  }

  return (
    <>
      <CContainer>
        <CRow>
          <CCol xl={5} style={{ paddingLeft: '0px' }}>
            <ListGroup
              onClickViewButton={onClickViewButton}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              grouplist={grouplist}
              setGrouplist={setGrouplist}
            />
          </CCol>
          <CCol xl={7}>
            <ListScheduledSounds
              showSounds={showSounds}
              showSoundsCounter={showSoundsCounter}
              selectedGroup={selectedGroup}
              grouplist={grouplist}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default ScheduledSounds
