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

const AllPlaylistsModal = (props) => {
  const [playlists, setPlaylists] = useState([])
  const [selectedPlayLists, setSelectedPlayLists] = useState([])
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.visible) {
      getAllPlaylists()
      setSelectedPlayLists([])
    }
  }, [props.visible])

  const getAllPlaylists = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getAllPlaylists')
      .then((res) => {
        handleResponse(res)
        if (res.data.playlists === 'empty') setPlaylists([])
        else {
          let list = res.data.playlists.filter(
            (x) => props.playlists.filter((s) => s.playlistName === x.name).length == 0,
          )
          list = list.sort(sortBy('name'))
          setPlaylists(list)
        }
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickPlaylist = (name) => {
    if (selectedPlayLists.indexOf(name) > -1)
      setSelectedPlayLists((prev) => prev.filter((x) => x !== name))
    else setSelectedPlayLists((prev) => [...prev, name])
  }

  const handleSelectPlaylistChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedPlayLists((prev) => [...prev, value])
    } else {
      setSelectedPlayLists((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickSaveButton = () => {
    const playlistIds = playlists
      .filter((x) => selectedPlayLists.indexOf(x.name) > -1)
      .map((x) => x.id)
    console.log('first', playlistIds)
    props.addPlaylistToRaspberry(playlistIds)
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()} size="lg">
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Add playlist</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {playlists.length === 0 ? (
          <div>There is no playlist. Please create playlist</div>
        ) : (
          <div>
            <CListGroup className="allitemsmodal-listGroup">
              {playlists.map((playlist, idx) => (
                <CListGroupItem
                  key={idx}
                  component="button"
                  onClick={() => onClickPlaylist(playlist.name)}
                  className="allitemsmodal-listbutton"
                  active={selectedPlayLists.indexOf(playlist.name) > -1}
                >
                  <Checkbox
                    style={{ padding: '0px 10px 0px 1px' }}
                    value={playlist.name}
                    onChange={handleSelectPlaylistChange}
                    checked={selectedPlayLists.indexOf(playlist.name) > -1}
                  />
                  {playlist.name}
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

export default AllPlaylistsModal
