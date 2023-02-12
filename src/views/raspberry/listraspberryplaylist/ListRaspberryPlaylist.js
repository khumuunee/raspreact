import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AddCircle, FullscreenExit, KeyboardDoubleArrowLeft } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkbox, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import AllPlaylistsModal from '../allplaylistsmodal/AllPlaylistsModal'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import { cibRaspberryPi, cilObjectGroup } from '@coreui/icons'
import CIcon from '@coreui/icons-react'

const ListRaspberryPlaylist = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylists, setSelectedPlaylists] = useState([])
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [showAllPlaylistsModal, setShowAllPlaylistsModal] = useState(false)
  const [currentRaspName, setcurrentRaspName] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showPlaylist) loadRaspberrysPlaylist()
    else setPlaylists([])
    setSelectedPlaylists([])
    setcurrentRaspName(getSelectedRaspName())
  }, [props.showPlaylistCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedPlaylists.length == 0)
  }, [selectedPlaylists])

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked)
      setSelectedPlaylists(
        playlists.filter((x) => x.isGroupPlaylist == 0).map((x) => x.playlistName),
      )
    else setSelectedPlaylists([])
  }

  const onClickAddPlaylistButton = () => {
    setShowAllPlaylistsModal(true)
  }

  const onClickDeleteButton = () => {
    mainContext.showModal(
      'Remove playlist - ' + currentRaspName,
      'Are sure remove playlist from the Raspberry?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const raspId = getSelectedRaspId()
    const playlistIds = playlists
      .filter((x) => selectedPlaylists.indexOf(x.playlistName) > -1)
      .map((x) => x.playlistId)
    axiosInstance
      .post('/removePlaylistsFromRaspberry', {
        playlistIds: playlistIds,
        raspId: raspId,
      })
      .then((res) => {
        handleResponse(res)
        setSelectedPlaylists([])
        loadRaspberrysPlaylist()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickPlaylist = (playlistName, isGroupPlaylist) => {
    if (isGroupPlaylist == 1) return
    if (selectedPlaylists.indexOf(playlistName) > -1)
      setSelectedPlaylists((prev) => prev.filter((x) => x !== playlistName))
    else setSelectedPlaylists((prev) => [...prev, playlistName])
  }

  const loadRaspberrysPlaylist = () => {
    mainContext.setShowLoader(true)
    const raspId = getSelectedRaspId()
    axiosInstance
      .get('/loadRaspberrysPlaylist/' + raspId)
      .then((res) => {
        handleResponse(res)
        if (res.data.listPlaylist) {
          let list = res.data.listPlaylist
          list = list.sort(sortBy('playlistName'))
          setPlaylists(list)
        } else setPlaylists([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const getSelectedRaspId = () => {
    return getSelectedRasp().id
  }
  const getSelectedRaspName = () => {
    return getSelectedRasp().name
  }
  const getSelectedRasp = () => {
    return props.raspberryList[
      props.raspberryList.map((x) => x.name).indexOf(props.selectedRaspberryList[0])
    ]
  }

  const addPlaylistToRaspberry = (addedPlaylistIds) => {
    if (addedPlaylistIds.length == 0) {
      mainContext.showWarningToast('Please select the playlist')
      return
    }
    setShowAllPlaylistsModal(false)
    const raspId = getSelectedRaspId()
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addPlaylistToRaspberry', {
        raspId: raspId,
        addedPlaylistIds: addedPlaylistIds,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberrysPlaylist()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickCollapseButton = () => {
    props.setshowPlaylist(false)
  }

  const onClickChangeActiveStatus = (raspberryId, playlistId, playlistName, isGroupPlaylist) => {
    if (isGroupPlaylist) return
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/changeActiveStatusOnRaspberrysPlaylist', {
        raspberryId: raspberryId,
        playlistId: playlistId,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberrysPlaylist()
        setSelectedPlaylists([playlistName])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  return (
    <>
      <CContainer className="header control-title" style={{ background: 'rgb(186 181 255)' }}>
        <CRow>
          <CCol xs={6}>
            <CHeaderBrand>Playlist</CHeaderBrand>
          </CCol>
          <CCol xs={6} style={{ textAlign: 'right' }}>
            <CHeaderBrand>{currentRaspName}</CHeaderBrand>
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
            <IconButton color="success" onClick={onClickAddPlaylistButton}>
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
      {props.showPlaylist ? (
        <>
          {playlists.length === 0 ? (
            <div style={{ margin: '22px 0px 0px 21px' }}>
              There is no playlist. Please add playlist
            </div>
          ) : (
            <div>
              <CListGroup
                className={props.showPlayer ? 'control-listGroup-short' : 'control-listGroup'}
              >
                {playlists.map((playlist, idx) => (
                  <CListGroupItem
                    key={idx}
                    component="button"
                    onClick={() => onClickPlaylist(playlist.playlistName, playlist.isGroupPlaylist)}
                    active={selectedPlaylists.indexOf(playlist.playlistName) > -1}
                  >
                    <CRow>
                      <CCol xs="10">
                        <Checkbox
                          style={{ padding: '0px 10px 0px 1px' }}
                          value={playlist.playlistName}
                          checked={selectedPlaylists.indexOf(playlist.playlistName) > -1}
                        />
                        {playlist.playlistName}
                      </CCol>
                      <CCol xs="1">
                        {playlist.isGroupPlaylist == 1 && (
                          <span>
                            <CIcon icon={cilObjectGroup} />
                          </span>
                        )}
                        {playlist.isGroupPlaylist == 0 && (
                          <span>
                            <CIcon icon={cibRaspberryPi} />
                          </span>
                        )}
                      </CCol>
                      <CCol xs="1" style={{ textAlign: 'right' }}>
                        <PlaylistAddCheckCircleIcon
                          onClick={() =>
                            onClickChangeActiveStatus(
                              playlist.raspberryId,
                              playlist.playlistId,
                              playlist.playlistName,
                              playlist.isGroupPlaylist,
                            )
                          }
                          style={
                            playlist.isActive == 1
                              ? playlist.isGroupPlaylist == 1
                                ? { color: 'blue' }
                                : { color: 'green' }
                              : {}
                          }
                        />
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
            Click on the playlist icon to view the playlist
          </div>
        </>
      )}
      {showAllPlaylistsModal && (
        <AllPlaylistsModal
          visible={showAllPlaylistsModal}
          onClose={() => setShowAllPlaylistsModal(false)}
          addPlaylistToRaspberry={addPlaylistToRaspberry}
          playlists={playlists}
        />
      )}
    </>
  )
}

export default ListRaspberryPlaylist
