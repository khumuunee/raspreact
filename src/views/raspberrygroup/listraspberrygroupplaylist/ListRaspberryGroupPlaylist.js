import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AddCircle, FullscreenExit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle'
import { Checkbox, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import AllPlaylistsModal from '../../raspberry/allplaylistsmodal/AllPlaylistsModal'

const ListRaspberryGroupPlaylist = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylists, setSelectedPlaylists] = useState([])
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [showAllPlaylistsModal, setShowAllPlaylistsModal] = useState(false)
  const [currentRaspGroupName, setcurrentRaspGroupName] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showPlaylist) loadRaspberryGroupsPlaylist()
    else setPlaylists([])
    setSelectedPlaylists([])
    setcurrentRaspGroupName(getSelectedRaspGroupName())
  }, [props.showPlaylistCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedPlaylists.length == 0)
  }, [selectedPlaylists])

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) setSelectedPlaylists(playlists.map((x) => x.playlistName))
    else setSelectedPlaylists([])
  }

  const onClickAddPlaylistButton = () => {
    setShowAllPlaylistsModal(true)
  }

  const onClickDeleteButton = () => {
    mainContext.showModal(
      'Remove playlist - ' + currentRaspGroupName,
      'Are sure remove playlist from the Raspberry group?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const raspGroupId = getSelectedRaspGroupId()
    const playlistIds = playlists
      .filter((x) => selectedPlaylists.indexOf(x.playlistName) > -1)
      .map((x) => x.playlistId)
    axiosInstance
      .post('/removePlaylistsFromRaspberryGroup', {
        playlistIds: playlistIds,
        raspGroupId: raspGroupId,
      })
      .then((res) => {
        handleResponse(res)
        setSelectedPlaylists([])
        loadRaspberryGroupsPlaylist()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickPlaylist = (playlistName) => {
    if (selectedPlaylists.indexOf(playlistName) > -1)
      setSelectedPlaylists((prev) => prev.filter((x) => x !== playlistName))
    else setSelectedPlaylists((prev) => [...prev, playlistName])
  }

  const loadRaspberryGroupsPlaylist = () => {
    mainContext.setShowLoader(true)
    const raspGroupId = getSelectedRaspGroupId()
    axiosInstance
      .get('/loadRaspberryGroupsPlaylist/' + raspGroupId)
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

  const getSelectedRaspGroupId = () => {
    return getSelectedRaspGroup().id
  }
  const getSelectedRaspGroupName = () => {
    return getSelectedRaspGroup().name
  }
  const getSelectedRaspGroup = () => {
    return props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])]
  }

  const addPlaylistToRaspberryGroup = (addedPlaylistIds) => {
    if (addedPlaylistIds.length == 0) {
      mainContext.showWarningToast('Please select the playlist')
      return
    }
    setShowAllPlaylistsModal(false)
    const raspGroupId = getSelectedRaspGroupId()
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addPlaylistToRaspberryGroup', {
        raspGroupId: raspGroupId,
        addedPlaylistIds: addedPlaylistIds,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberryGroupsPlaylist()
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

  const onClickChangeActiveStatus = (raspberryGroupId, playlistId, playlistName) => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/changeActiveStatusOnRaspberryGroupsPlaylist', {
        raspberryGroupId: raspberryGroupId,
        playlistId: playlistId,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberryGroupsPlaylist()
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
              <CListGroup className="control-listGroup">
                {playlists.map((playlist, idx) => (
                  <CListGroupItem
                    key={idx}
                    component="button"
                    onClick={() => onClickPlaylist(playlist.playlistName)}
                    active={selectedPlaylists.indexOf(playlist.playlistName) > -1}
                  >
                    <CRow>
                      <CCol xs="9">
                        <Checkbox
                          style={{ padding: '0px 10px 0px 1px' }}
                          value={playlist.playlistName}
                          checked={selectedPlaylists.indexOf(playlist.playlistName) > -1}
                        />
                        {playlist.playlistName}
                      </CCol>
                      <CCol xs="3" style={{ textAlign: 'right' }}>
                        <PlaylistAddCheckCircleIcon
                          onClick={() =>
                            onClickChangeActiveStatus(
                              playlist.raspberryGroupId,
                              playlist.playlistId,
                              playlist.playlistName,
                            )
                          }
                          style={playlist.isActive == 1 ? { color: 'green' } : {}}
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
          addPlaylistToRaspberry={addPlaylistToRaspberryGroup}
          playlists={playlists}
        />
      )}
    </>
  )
}

export default ListRaspberryGroupPlaylist
