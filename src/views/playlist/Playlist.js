import { CCol, CContainer, CRow } from '@coreui/react'
import { useEffect, useState } from 'react'
import ListPlaylist from './listplaylist/ListPlaylist'
import ListSounds from './listsounds/ListSounds'
import './playlist.scss'

function Playlist() {
  const [showSounds, setShowSounds] = useState(false)
  //playlist deerh nuden deer darahad soundlist-g dahin ugugdluu load hiihed zoriulj avlaa(ListSounds->useEffect)
  const [showSoundsCounter, setShowSoundsCounter] = useState(0)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState([])

  useEffect(() => {
    if (selectedPlaylist.length != 1) setShowSounds(false)
  }, [selectedPlaylist])

  const onClickViewButton = () => {
    setShowSounds(true)
    setShowSoundsCounter(showSoundsCounter === 1000 ? 0 : showSoundsCounter + 1)
  }

  return (
    <>
      <CContainer>
        <CRow>
          <CCol xl={5} style={{ paddingLeft: '0px' }}>
            <ListPlaylist
              onClickViewButton={onClickViewButton}
              selectedPlaylist={selectedPlaylist}
              setSelectedPlaylist={setSelectedPlaylist}
              playlists={playlists}
              setPlaylists={setPlaylists}
            />
          </CCol>
          <CCol xl={7}>
            <ListSounds
              showSounds={showSounds}
              showSoundsCounter={showSoundsCounter}
              selectedPlaylist={selectedPlaylist}
              playlists={playlists}
            />
          </CCol>
        </CRow>
      </CContainer>
    </>
  )
}

export default Playlist
