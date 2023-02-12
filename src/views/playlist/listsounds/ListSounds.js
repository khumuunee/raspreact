import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { IconButton } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  AddCircle,
  DragHandle,
  MusicNote,
  PlaylistAddCircle,
  VolumeDown,
} from '@mui/icons-material'
import Checkbox from '@mui/material/Checkbox'
import '../playlist.scss'
import AllSoundsModal from '../allsoundsmodal/AllSoundsModal'
import MainContext from 'src/context/MainContext'
import axiosInstance from 'src/axios-blm'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import { sortBy } from 'src/tools/BaseTool'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import MeshPlaylistModal from '../meshplaylistmodal/MeshPlaylistModal'

const ListSounds = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [soundList, setSoundList] = useState([])
  const [selectedSoundList, setSelectedSoundList] = useState([])
  const [showAllSoundsModal, setShowAllSoundsModal] = useState(false)
  const [showMeshPlaylistModal, setshowMeshPlaylistModal] = useState(false)
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showSounds) loadPlaylistSounds()
    else {
      setSoundList([])
    }
    setSelectedSoundList([])
  }, [props.showSoundsCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedSoundList.length == 0)
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

  const loadPlaylistSounds = () => {
    mainContext.setShowLoader(true)
    const playlistId =
      props.playlists[props.playlists.map((x) => x.name).indexOf(props.selectedPlaylist[0])].id
    axiosInstance
      .get('/loadPlaylistSounds/' + playlistId)
      .then((res) => {
        handleResponse(res)
        if (res.data.listSound) {
          let list = res.data.listSound
          list = list.sort(sortBy('orderNumber', false))
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
      'Are sure remove sounds from the playlist?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const playlistId =
      props.playlists[props.playlists.map((x) => x.name).indexOf(props.selectedPlaylist[0])].id
    axiosInstance
      .post('/removeSoundsFromPlaylist', { sounds: selectedSoundList, playlistId: playlistId })
      .then((res) => {
        handleResponse(res)
        if (res.data.listSound) {
          let list = res.data.listSound
          list = list.sort(sortBy('orderNumber', false))
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
    if (props.selectedPlaylist.length != 1) {
      mainContext.showWarningToast('Please select a playlist')
      return
    }
    setShowAllSoundsModal(true)
  }

  const onCloseAllSoundsModal = () => {
    setShowAllSoundsModal(false)
  }

  const addSoundsToPlaylist = (addedSoundList) => {
    if (addedSoundList.length == 0) {
      mainContext.showWarningToast('Please select the sounds')
      return
    }
    setShowAllSoundsModal(false)
    const playlistId =
      props.playlists[props.playlists.map((x) => x.name).indexOf(props.selectedPlaylist[0])].id
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addSoundsToPlaylist', {
        playlistId: playlistId,
        addedSoundList: addedSoundList,
      })
      .then((res) => {
        handleResponse(res)
        loadPlaylistSounds()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickAddSoundsFromAnotherPlaylist = () => {
    if (props.selectedPlaylist.length != 1) {
      mainContext.showWarningToast('Please select a playlist')
      return
    }
    setshowMeshPlaylistModal(true)
  }

  const onCloseMeshPlaylistModal = () => {
    setshowMeshPlaylistModal(false)
  }

  const addSoundsFromAnotherPlaylist = (selectedSongPlaylist, selectedAdPlaylist) => {
    const playlistId =
      props.playlists[props.playlists.map((x) => x.name).indexOf(props.selectedPlaylist[0])].id
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/meshPlaylist', {
        playlistId: playlistId,
        selectedSongPlaylist: selectedSongPlaylist,
        selectedAdPlaylist: selectedAdPlaylist,
      })
      .then((res) => {
        handleResponse(res)
        let list = res.data.listSound
        list = list.sort(sortBy('orderNumber', false))
        setSoundList(list)
        setshowMeshPlaylistModal(false)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onDragEnd = (param) => {
    const srcI = param.source.index
    const desI = param.destination?.index
    if (!param.destination || srcI === desI) return
    const playlistId =
      props.playlists[props.playlists.map((x) => x.name).indexOf(props.selectedPlaylist[0])].id
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/reorderPlaylistSounds', { srcI: srcI, desI: desI, playlistId: playlistId })
      .then((res) => {
        handleResponse(res)
        let list = res.data.listSound
        list = list.sort(sortBy('orderNumber', false))
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
      <CContainer className="header playlist-title">
        <CHeaderBrand>Sounds</CHeaderBrand>
      </CContainer>
      <CContainer className="header playlist-header">
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
              color="primary"
              disabled={deleteButtonDisabled}
              onClick={onClickDeleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </CCol>
          <CCol>
            <IconButton
              color="success"
              onClick={onClickAddSoundsFromAnotherPlaylist}
              disabled={!props.showSounds}
            >
              <PlaylistAddCircle />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {props.showSounds ? (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            {soundList.length === 0 ? (
              <div style={{ margin: '22px 0px 0px 21px' }}>
                There is no sounds. Please add sounds
              </div>
            ) : (
              <div>
                <CListGroup className="playlist-listGroup">
                  <Droppable droppableId="droppable-1">
                    {(provided, _) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {soundList.map((sound, idx) => (
                          <Draggable key={idx} draggableId={'draggable-' + idx} index={idx}>
                            {(provided, snapshot) => (
                              <CListGroupItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  //boxShadow: snapshot.isDragging ? '0 0 .4rem #666' : 'none',
                                }}
                                key={idx}
                                component="button"
                                onClick={() => onClickSound(sound.soundName)}
                                active={selectedSoundList.indexOf(sound.soundName) > -1}
                              >
                                <CRow>
                                  <CCol xs="10">
                                    <Checkbox
                                      style={{ padding: '0px 10px 0px 1px' }}
                                      value={sound.soundName}
                                      onChange={handleSelectSoundChange}
                                      checked={selectedSoundList.indexOf(sound.soundName) > -1}
                                    />
                                    {sound.soundName}
                                  </CCol>
                                  <CCol xs="1">
                                    {sound.soundType === 'Song' && <MusicNote color="primary" />}
                                    {sound.soundType === 'Ad' && <VolumeDown color="secondary" />}
                                  </CCol>
                                  <CCol xs="1" style={{ textAlign: 'right' }}>
                                    <div {...provided.dragHandleProps}>
                                      <DragHandle />
                                    </div>
                                  </CCol>
                                </CRow>
                              </CListGroupItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </CListGroup>
              </div>
            )}
          </DragDropContext>
        </>
      ) : (
        <>
          <div style={{ margin: '22px 0px 0px 21px' }}>
            Click on the arrow icon to view the sounds
          </div>
        </>
      )}
      {showAllSoundsModal && (
        <AllSoundsModal
          visible={showAllSoundsModal}
          onClose={onCloseAllSoundsModal}
          addSoundsToPlaylist={addSoundsToPlaylist}
          soundList={soundList}
        />
      )}
      {showMeshPlaylistModal && (
        <MeshPlaylistModal
          visible={showMeshPlaylistModal}
          onClose={onCloseMeshPlaylistModal}
          addSoundsFromAnotherPlaylist={addSoundsFromAnotherPlaylist}
        />
      )}
    </div>
  )
}

export default ListSounds
