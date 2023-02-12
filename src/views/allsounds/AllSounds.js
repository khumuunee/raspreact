import {
  CCol,
  CContainer,
  CFormSelect,
  CHeaderBrand,
  CListGroup,
  CListGroupItem,
  CRow,
} from '@coreui/react'
import { AccessAlarms, AddAlarm, MusicNote, VolumeDown } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Button, IconButton } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import './allsounds.scss'

function AllSounds() {
  const [allSoundList, setAllSoundList] = useState([])
  const [soundList, setSoundList] = useState([])
  const [selectedSoundList, setSelectedSoundList] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [soundType, setsoundType] = useState('Sound type')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    getAllSounds()
  }, [])

  useEffect(() => {
    setDeleteButtonDisabled(selectedSoundList.length == 0)
  }, [selectedSoundList])

  useEffect(() => {
    if (soundType === 'Sound type' || allSoundList.length === 0) return
    if (soundType === 'All') {
      setSoundList(allSoundList)
      return
    }
    setSoundList(allSoundList.filter((x) => x.type === soundType))
    setSelectedSoundList([])
  }, [soundType])

  useEffect(() => {
    if (soundList.length == 0) {
      setDeleteButtonDisabled(true)
      setSelectAll(false)
    }
  }, [soundList])

  const getAllSounds = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getAllSounds')
      .then((res) => {
        handleResponse(res)
        if (res.data.soundList === 'empty') {
          setSoundList([])
          setAllSoundList([])
        } else {
          let list = res.data.soundList
          list = list.sort(sortBy('name'))
          setSoundList(list)
          setAllSoundList(list)
        }
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
    if (event.target.checked) setSelectedSoundList(soundList.map((s) => s.name))
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

  const onClickDeleteButton = () => {
    mainContext.showModal('Delete sounds', 'Are sure delete sounds?', onClickDeleteButtonYes)
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const selectedSounds = allSoundList.filter((x) => selectedSoundList.indexOf(x.name) > -1)
    axiosInstance
      .post('/deleteSounds', selectedSounds)
      .then((res) => {
        handleResponse(res)
        setSoundList(soundList.filter((x) => selectedSoundList.indexOf(x.name) === -1))
        setAllSoundList(soundList.filter((x) => selectedSoundList.indexOf(x.name) === -1))
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickSound = (soundName) => {
    if (selectedSoundList.indexOf(soundName) > -1)
      setSelectedSoundList((prev) => prev.filter((x) => x !== soundName))
    else setSelectedSoundList((prev) => [...prev, soundName])
  }

  const onChangeSoundType = (e) => {
    setsoundType(e.target.value)
  }

  return (
    <>
      <CContainer className="header control-title">
        <CHeaderBrand>All sounds</CHeaderBrand>
      </CContainer>
      <CContainer className="allsounds-header header">
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
            <IconButton
              aria-label="delete"
              color="primary"
              disabled={deleteButtonDisabled}
              onClick={onClickDeleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </CCol>
          <CCol>
            <CFormSelect
              onChange={onChangeSoundType}
              value={soundType}
              options={[
                'Sound type',
                { label: 'All', value: 'All' },
                { label: 'Song', value: 'Song' },
                { label: 'Ad', value: 'Ad' },
                { label: 'Scheduled Sound', value: 'ScheduledSound' },
              ]}
            />
          </CCol>
        </CRow>
      </CContainer>
      {soundList.length === 0 ? (
        <div style={{ margin: '22px 0px 0px 21px' }}>There is no sounds. Please upload sounds</div>
      ) : (
        <div>
          <CListGroup className="allsounds-listGroup">
            {soundList.map((sound, idx) => (
              <CListGroupItem
                key={idx}
                component="button"
                onClick={() => onClickSound(sound.name)}
                active={selectedSoundList.indexOf(sound.name) > -1}
              >
                <CRow>
                  <CCol xs="10">
                    <Checkbox
                      style={{ padding: '0px 10px 0px 1px' }}
                      value={sound.name}
                      onChange={handleSelectSoundChange}
                      checked={selectedSoundList.indexOf(sound.name) > -1}
                    />
                    {sound.name}
                  </CCol>
                  <CCol xs="2" style={{ textAlign: 'right' }}>
                    {sound.type === 'Song' && <MusicNote color="primary" />}
                    {sound.type === 'Ad' && <VolumeDown color="secondary" />}
                    {sound.type === 'ScheduledSound' && <AccessAlarms color="error" />}
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>
      )}
    </>
  )
}

export default AllSounds
