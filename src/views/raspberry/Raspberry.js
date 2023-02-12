import { CCol, CContainer, CRow } from '@coreui/react'
import { useState } from 'react'
import ListRaspberry from './listraspberry/ListRaspberry'
import ListRaspberryPlaylist from './listraspberryplaylist/ListRaspberryPlaylist'
import ListRaspberryScheduledSound from './listraspberryscheduledsound/ListRaspberryScheduledSound'
import Player from './player/Player'
import './player/player.scss'

const Raspberry = () => {
  const [raspberryList, setraspberryList] = useState([])
  const [selectedRaspberryList, setselectedRaspberryList] = useState([])
  const [showPlaylist, setshowPlaylist] = useState(false)
  const [showPlaylistCounter, setShowPlaylistCounter] = useState(0)
  const [showScheduledSound, setshowScheduledSound] = useState(false)
  const [showScheduledSoundCounter, setshowScheduledSoundCounter] = useState(0)
  //Player-iin state-uud
  const [showPlayer, setShowPlayer] = useState(false)
  const [playerData, setPlayerData] = useState({})

  const onClickPlaylistButton = () => {
    setshowPlaylist(true)
    setshowScheduledSound(false)
    setShowPlaylistCounter(showPlaylistCounter === 1000 ? 0 : showPlaylistCounter + 1)
  }

  const onClickScheduledSoundButton = () => {
    setshowPlaylist(false)
    setshowScheduledSound(true)
    setshowScheduledSoundCounter(
      showScheduledSoundCounter === 1000 ? 0 : showScheduledSoundCounter + 1,
    )
  }

  return (
    <>
      <CContainer>
        <CRow>
          <CCol
            xs={showPlaylist || showScheduledSound ? 7 : 12}
            style={{ paddingLeft: '0px', paddingRight: '0px' }}
          >
            <ListRaspberry
              raspberryList={raspberryList}
              setraspberryList={setraspberryList}
              selectedRaspberryList={selectedRaspberryList}
              setselectedRaspberryList={setselectedRaspberryList}
              onClickPlaylistButton={onClickPlaylistButton}
              onClickScheduledSoundButton={onClickScheduledSoundButton}
              showPlayer={showPlayer}
              setShowPlayer={setShowPlayer}
              setPlayerData={setPlayerData}
            />
          </CCol>
          {showPlaylist && (
            <CCol xs={5} style={{ paddingRight: '0px' }}>
              <ListRaspberryPlaylist
                showPlaylist={showPlaylist}
                raspberryList={raspberryList}
                selectedRaspberryList={selectedRaspberryList}
                showPlaylistCounter={showPlaylistCounter}
                setshowPlaylist={setshowPlaylist}
                showPlayer={showPlayer}
              />
            </CCol>
          )}
          {showScheduledSound && (
            <CCol xs={5} style={{ paddingRight: '0px' }}>
              <ListRaspberryScheduledSound
                showScheduledSound={showScheduledSound}
                raspberryList={raspberryList}
                selectedRaspberryList={selectedRaspberryList}
                showScheduledSoundCounter={showScheduledSoundCounter}
                setshowScheduledSound={setshowScheduledSound}
                showPlayer={showPlayer}
              />
            </CCol>
          )}
        </CRow>
        {showPlayer && (
          <CRow>
            <Player playerData={playerData} setShowPlayer={setShowPlayer} />
          </CRow>
        )}
      </CContainer>
    </>
  )
}

export default Raspberry
