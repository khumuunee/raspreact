import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AddCircle, CloudSync, Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import { Checkbox, IconButton } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { removeAllWhiteSpace, sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import CreatePlaylistModal from '../createplaylistmodal/CreatePlaylistModal'
import '../playlist.scss'

const ListPlaylist = (props) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  //CreatePlaylistModal duudahdaa create esvel edit button daragdaj duudagdaj baigaa. Tuuniig yalgah zorilgoor avlaa
  const [clickedButtonName, setClickedButtonName] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    loadPlaylists()
  }, [])

  useEffect(() => {
    setEditButtonDisabled(props.selectedPlaylist.length != 1)
    setDeleteButtonDisabled(props.selectedPlaylist.length == 0)
  }, [props.selectedPlaylist])

  useEffect(() => {
    if (props.playlists.length == 0) {
      setEditButtonDisabled(true)
      setDeleteButtonDisabled(true)
      setSelectAll(false)
    }
  }, [props.playlists])

  const loadPlaylists = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/loadPlaylists')
      .then((res) => {
        handleResponse(res)
        if (res.data.playlists) {
          let list = res.data.playlists
          list = list.sort(sortBy('name'))
          props.setPlaylists(list)
        } else props.setPlaylists([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickCreatePlaylist = () => {
    setPlaylistName('')
    setShowCreateModal(true)
    setClickedButtonName('create')
  }

  const onCloseCreatePlaylistModal = () => {
    setShowCreateModal(false)
  }

  const savePlaylist = () => {
    if (!playlistName || removeAllWhiteSpace(playlistName).length == 0) {
      mainContext.showWarningToast('Please enter the name', true)
      return
    }
    if (clickedButtonName === 'create') createNewPlaylist()
    else updatePlaylist()
  }
  const createNewPlaylist = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/savePlaylist', { playlistName: playlistName })
      .then((res) => {
        handleResponse(res)
        setShowCreateModal(false)
        loadPlaylists()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }
  const updatePlaylist = () => {
    if (props.selectedPlaylist[0].trim() === playlistName.trim()) {
      setShowCreateModal(false)
      return
    }
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/updatePlaylist', { oldName: props.selectedPlaylist[0], newName: playlistName.trim() })
      .then((res) => {
        handleResponse(res)
        setShowCreateModal(false)
        let list = props.playlists
        list[list.map((x) => x.name).indexOf(props.selectedPlaylist[0])].name = playlistName.trim()
        props.setPlaylists(list)
        props.setSelectedPlaylist([playlistName.trim()])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) props.setSelectedPlaylist(props.playlists.map((x) => x.name))
    else props.setSelectedPlaylist([])
  }

  const handleSelectPlaylistChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      props.setSelectedPlaylist((prev) => [...prev, value])
    } else {
      props.setSelectedPlaylist((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickPlaylist = (playlist) => {
    if (props.selectedPlaylist.indexOf(playlist.name) > -1)
      props.setSelectedPlaylist((prev) => prev.filter((x) => x !== playlist.name))
    else props.setSelectedPlaylist((prev) => [...prev, playlist.name])
  }

  const onClickEditButton = () => {
    setPlaylistName(props.selectedPlaylist[0])
    setShowCreateModal(true)
    setClickedButtonName('edit')
  }

  const onClickDeleteButton = () => {
    mainContext.showModal('Delete playlist', 'Are sure delete playlist?', onClickDeleteButtonYes)
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const ids = props.playlists
      .filter((x) => props.selectedPlaylist.indexOf(x.name) !== -1)
      .map((x) => x.id)
    axiosInstance
      .post('/deletePlaylists', ids)
      .then((res) => {
        handleResponse(res)
        props.setPlaylists(
          props.playlists
            .filter((x) => props.selectedPlaylist.indexOf(x.name) === -1)
            .sort(sortBy('name')),
        )
        props.setSelectedPlaylist([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickEyeButton = (playlist) => {
    props.setSelectedPlaylist([playlist.name])
    props.onClickViewButton()
  }

  return (
    <>
      <CContainer className="header playlist-title" style={{ background: 'rgb(186 181 255)' }}>
        <CHeaderBrand>Playlist</CHeaderBrand>
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
            <IconButton color="success" onClick={onClickCreatePlaylist}>
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
          <CCol>
            <IconButton color="secondary" disabled={true}>
              <CloudSync />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {props.playlists.length === 0 ? (
        <div style={{ margin: '22px 0px 0px 21px' }}>
          There is no playlist. Please create a new playlist
        </div>
      ) : (
        <div>
          <CListGroup className="playlist-listGroup">
            {props.playlists.map((playlist, idx) => (
              <CListGroupItem
                key={idx}
                component="button"
                active={props.selectedPlaylist.indexOf(playlist.name) > -1}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <CRow>
                  <CCol xs="1" style={{ lineHeight: '40px' }}>
                    <Checkbox
                      style={{ padding: '0px 10px 0px 1px' }}
                      value={playlist.name}
                      onChange={handleSelectPlaylistChange}
                      checked={props.selectedPlaylist.indexOf(playlist.name) > -1}
                    />
                  </CCol>
                  <CCol
                    xs="10"
                    style={{ lineHeight: '40px' }}
                    onClick={() => onClickPlaylist(playlist)}
                  >
                    {playlist.name}
                  </CCol>
                  <CCol
                    xs="1"
                    style={{ lineHeight: '40px', paddingLeft: '0px' }}
                    onClick={() => onClickEyeButton(playlist)}
                  >
                    <span style={{ color: 'black' }}>
                      <KeyboardDoubleArrowRightIcon />
                    </span>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>
      )}
      {showCreateModal && (
        <CreatePlaylistModal
          visible={showCreateModal}
          onClose={onCloseCreatePlaylistModal}
          savePlaylist={savePlaylist}
          name={playlistName}
          setName={setPlaylistName}
        />
      )}
    </>
  )
}

export default ListPlaylist
