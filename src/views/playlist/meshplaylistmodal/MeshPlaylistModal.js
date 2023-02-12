import {
  CButton,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
const MeshPlaylistModal = (props) => {
  const [songPlaylists, setSongPlaylists] = useState([])
  const [adPlaylists, setAdPlaylists] = useState([])
  const [selectedSongPlaylist, setselectedSongPlaylist] = useState('Please select song playlist')
  const [selectedAdPlaylist, setselectedAdPlaylist] = useState('Please select ad playlist')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    getAllPlaylists()
  }, [])

  const getAllPlaylists = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getAllPlaylists')
      .then((res) => {
        handleResponse(res)
        if (res.data.playlists === 'empty') setPlaylists([''])
        else {
          let list = res.data.playlists
          list = list.sort(sortBy('name'))
          list = list.map((x) => ({ label: x.name, value: x.name }))
          setSongPlaylists(['Please select song playlist', ...list])
          setAdPlaylists(['Please select ad playlist', ...list])
        }
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onChangeSongPlaylist = (e) => {
    setselectedSongPlaylist(e.target.value)
  }
  const onChangeAdPlaylist = (e) => {
    setselectedAdPlaylist(e.target.value)
  }

  const onClickSaveButton = () => {
    if (selectedSongPlaylist === 'Please select song playlist') {
      mainContext.showWarningToast('Please select song playlist')
      return
    }
    if (selectedAdPlaylist === 'Please select ad playlist') {
      mainContext.showWarningToast('Please select ad playlist')
      return
    }
    if (selectedSongPlaylist === selectedAdPlaylist) {
      mainContext.showWarningToast('Please select different playlists')
      return
    }
    props.addSoundsFromAnotherPlaylist(selectedSongPlaylist, selectedAdPlaylist)
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()}>
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Mesh playlist</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect
          onChange={onChangeSongPlaylist}
          value={selectedSongPlaylist}
          options={songPlaylists}
        />
        <br />
        <CFormSelect
          onChange={onChangeAdPlaylist}
          value={selectedAdPlaylist}
          options={adPlaylists}
        />
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

export default MeshPlaylistModal
