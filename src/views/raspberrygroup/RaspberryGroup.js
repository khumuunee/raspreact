import { CCol, CContainer, CRow } from '@coreui/react'
import React, { useEffect, useState } from 'react'
import ListRaspberryGroup from './listraspberrygroup/ListRaspberryGroup'
import ListRaspberryGroupPlaylist from './listraspberrygroupplaylist/ListRaspberryGroupPlaylist'
import ListRaspberryGroupScheduledSound from './listraspberrygroupscheduledsound/ListRaspberryGroupScheduledSound'
import ListRaspberryInGroup from './listraspberryingroup/ListRaspberryInGroup'

const RaspberryGroup = () => {
  const [showRaspberrys, setShowRaspberrys] = useState(false)
  const [showRaspberrysList, setshowRaspberrysList] = useState(true)
  const [showRaspberrysCounter, setShowRaspberrysCounter] = useState(0)
  const [grouplist, setGrouplist] = useState([])
  const [selectedGroup, setSelectedGroup] = useState([])
  const [showPlaylist, setshowPlaylist] = useState(false)
  const [showPlaylistCounter, setShowPlaylistCounter] = useState(0)
  const [showScheduledSound, setshowScheduledSound] = useState(false)
  const [showScheduledSoundCounter, setshowScheduledSoundCounter] = useState(0)

  useEffect(() => {
    if (selectedGroup.length != 1) setShowRaspberrys(false)
  }, [selectedGroup])

  const onClickViewButton = () => {
    setShowRaspberrys(true)
    setshowPlaylist(false)
    setshowScheduledSound(false)
    setshowRaspberrysList(true)
    setShowRaspberrysCounter(showRaspberrysCounter === 1000 ? 0 : showRaspberrysCounter + 1)
  }

  const onClickPlaylistButton = () => {
    setshowPlaylist(true)
    setshowScheduledSound(false)
    setshowRaspberrysList(false)
    setShowPlaylistCounter(showPlaylistCounter === 1000 ? 0 : showPlaylistCounter + 1)
  }

  const onClickScheduledSoundButton = () => {
    setshowPlaylist(false)
    setshowScheduledSound(true)
    setshowRaspberrysList(false)
    setshowScheduledSoundCounter(
      showScheduledSoundCounter === 1000 ? 0 : showScheduledSoundCounter + 1,
    )
  }

  return (
    <>
      <CContainer>
        <CRow>
          <CCol xl={5} style={{ paddingLeft: '0px' }}>
            <ListRaspberryGroup
              onClickViewButton={onClickViewButton}
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              grouplist={grouplist}
              setGrouplist={setGrouplist}
              onClickPlaylistButton={onClickPlaylistButton}
              onClickScheduledSoundButton={onClickScheduledSoundButton}
            />
          </CCol>
          {showRaspberrysList && (
            <CCol xl={7}>
              <ListRaspberryInGroup
                showRaspberrys={showRaspberrys}
                showRaspberrysCounter={showRaspberrysCounter}
                selectedGroup={selectedGroup}
                grouplist={grouplist}
              />
            </CCol>
          )}
          {showPlaylist && (
            <CCol xs={7} style={{ paddingRight: '0px' }}>
              <ListRaspberryGroupPlaylist
                showPlaylist={showPlaylist}
                selectedGroup={selectedGroup}
                grouplist={grouplist}
                showPlaylistCounter={showPlaylistCounter}
                setshowPlaylist={setshowPlaylist}
              />
            </CCol>
          )}
          {showScheduledSound && (
            <CCol xs={5} style={{ paddingRight: '0px' }}>
              <ListRaspberryGroupScheduledSound
                showScheduledSound={showScheduledSound}
                grouplist={grouplist}
                selectedGroup={selectedGroup}
                showScheduledSoundCounter={showScheduledSoundCounter}
                setshowScheduledSound={setshowScheduledSound}
              />
            </CCol>
          )}
        </CRow>
      </CContainer>
    </>
  )
}

export default RaspberryGroup
