import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AccessAlarms, AddCircle, CloudSync, Edit, MusicVideo } from '@mui/icons-material'
import CableIcon from '@mui/icons-material/Cable'
import DeleteIcon from '@mui/icons-material/Delete'
import { Checkbox, IconButton, Tooltip } from '@mui/material'

import { cilFeaturedPlaylist } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy, validateIpAddress } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import RaspModal from '../raspmodal/RaspModal'

const ListRaspberry = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [cableButtonDisabled, setcableButtonDisabled] = useState(true)
  const [syncButtonDisabled, setSyncButtonDisabled] = useState(true)
  const [showRaspModal, setshowRaspModal] = useState(false)
  //RaspModal duudahdaa create esvel edit button daragdaj duudagdaj baigaa. Tuuniig yalgah zorilgoor avlaa
  const [clickedButtonName, setclickedButtonName] = useState('')
  const [raspName, setraspName] = useState('')
  const [raspIpAddress, setraspIpAddress] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    loadRaspberryList()
  }, [])

  useEffect(() => {
    setEditButtonDisabled(props.selectedRaspberryList.length != 1)
    setDeleteButtonDisabled(props.selectedRaspberryList.length == 0)
    setcableButtonDisabled(props.selectedRaspberryList.length == 0)
    setSyncButtonDisabled(props.selectedRaspberryList.length == 0)
  }, [props.selectedRaspberryList])

  useEffect(() => {
    if (props.raspberryList.length == 0) {
      setEditButtonDisabled(true)
      setDeleteButtonDisabled(true)
      setcableButtonDisabled(true)
      setSyncButtonDisabled(true)
      setSelectAll(false)
    }
  }, [props.raspberryList])

  const loadRaspberryList = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/loadRaspberryList')
      .then((res) => {
        handleResponse(res)
        if (res.data.listRasp) {
          let list = res.data.listRasp
          list = list.sort(sortBy('name'))
          props.setraspberryList(list)
        } else props.setraspberryList([])
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
    if (event.target.checked) props.setselectedRaspberryList(props.raspberryList.map((x) => x.name))
    else props.setselectedRaspberryList([])
  }

  const onClickCreateRaspberryButton = () => {
    setraspName('')
    setraspIpAddress('')
    setshowRaspModal(true)
    setclickedButtonName('create')
  }

  const getSelectedRasp = () => {
    return props.raspberryList[
      props.raspberryList.map((x) => x.name).indexOf(props.selectedRaspberryList[0])
    ]
  }

  const onClickEditButton = () => {
    const ipAddress = getSelectedRasp().ipAddress
    setraspName(props.selectedRaspberryList[0])
    setraspIpAddress(ipAddress)
    setshowRaspModal(true)
    setclickedButtonName('edit')
  }

  const saveRasp = () => {
    if (!raspName) {
      mainContext.showWarningToast('Please enter the name')
      return
    }
    if (!raspIpAddress) {
      mainContext.showWarningToast('Please enter the ip address')
      return
    }
    if (!validateIpAddress(raspIpAddress)) {
      mainContext.showWarningToast('Please enter correct ip address')
      return
    }
    if (clickedButtonName === 'create') createNewRasp()
    else updateRasp()
  }

  const createNewRasp = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/createNewRaspberry', { name: raspName.trim(), ipAddress: raspIpAddress })
      .then((res) => {
        handleResponse(res)
        setshowRaspModal(false)
        loadRaspberryList()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const updateRasp = () => {
    const activeRasp = getSelectedRasp()
    if (activeRasp.name === raspName.trim() && activeRasp.ipAddress === raspIpAddress.trim()) {
      setshowRaspModal(false)
      return
    }
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/updateRaspberry', {
        name: raspName.trim(),
        ipAddress: raspIpAddress.trim(),
        id: activeRasp.id,
      })
      .then((res) => {
        handleResponse(res)
        setshowRaspModal(false)
        let list = props.raspberryList
        activeRasp.name = raspName.trim()
        activeRasp.ipAddress = raspIpAddress.trim()
        list[list.map((x) => x.name).indexOf(props.selectedRaspberryList[0])] = activeRasp
        props.setraspberryList(list)
        props.setselectedRaspberryList([raspName.trim()])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickRaspItem = (rasp) => {
    if (props.selectedRaspberryList.indexOf(rasp.name) > -1)
      props.setselectedRaspberryList((prev) => prev.filter((x) => x !== rasp.name))
    else props.setselectedRaspberryList((prev) => [...prev, rasp.name])
  }

  const onClickDeleteButton = () => {
    mainContext.showModal('Delete Raspberry', 'Are sure delete Raspberry?', onClickDeleteButtonYes)
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const ids = props.raspberryList
      .filter((x) => props.selectedRaspberryList.indexOf(x.name) !== -1)
      .map((x) => x.id)
    axiosInstance
      .post('/deleteRaspberry', ids)
      .then((res) => {
        handleResponse(res)
        props.setraspberryList(
          props.raspberryList
            .filter((x) => props.selectedRaspberryList.indexOf(x.name) === -1)
            .sort(sortBy('name')),
        )
        props.setselectedRaspberryList([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickCableButton = () => {
    const selectedRaspList = props.raspberryList.filter(
      (x) => props.selectedRaspberryList.indexOf(x.name) !== -1,
    )
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/checkConnectionRaspberry', selectedRaspList)
      .then((res) => {
        handleResponse(res)
        let list = [...props.raspberryList]
        for (const rasp of list) {
          if (res.data.checkedList.findIndex((x) => x.id === rasp.id) > -1) {
            rasp.currentStatus =
              res.data.checkedList[
                res.data.checkedList.findIndex((x) => x.id === rasp.id)
              ].currentStatus
          } else rasp.currentStatus = 'Ready'
        }
        props.setraspberryList(list.sort(sortBy('name')))
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickPlaylistButton = (rasp) => {
    props.setselectedRaspberryList([rasp.name])
    props.onClickPlaylistButton()
  }

  const onClickScheduledSoundButton = (rasp) => {
    props.setselectedRaspberryList([rasp.name])
    props.onClickScheduledSoundButton()
  }

  const onClickSyncButton = () => {
    const raspIds = props.raspberryList
      .filter((x) => props.selectedRaspberryList.indexOf(x.name) !== -1)
      .map((x) => x.id)
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/transferPlaylistToRaspberry', { raspIds: raspIds })
      .then((res) => {
        handleResponse(res)
        let list = [...props.raspberryList]
        for (const rasp of list) {
          if (res.data.listRasp.findIndex((x) => x.id === rasp.id) > -1) {
            const currentRasp =
              res.data.listRasp[res.data.listRasp.findIndex((x) => x.id === rasp.id)]
            rasp.currentStatus = currentRasp.currentStatus
            rasp.statusMessage = currentRasp.statusMessage
            if (rasp.currentStatus === 'Success') startPlaylistOnRaspberry(rasp)
          } else rasp.currentStatus = 'Ready'
        }
        props.setraspberryList(list.sort(sortBy('name')))
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
        props.setShowPlayer(false)
      })
  }

  const startPlaylistOnRaspberry = (rasp) => {
    axiosInstance.post('/startPlaylistOnRaspberry', { rasp: rasp }).then((res) => {
      handleResponse(res)
    })
  }

  const onShowPlayerButton = (rasp) => {
    props.setselectedRaspberryList([rasp.name])
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/getCurrentPlayerFromRaspberry', { rasp: rasp })
      .then((res) => {
        handleResponse(res)
        props.setPlayerData(res.data)
        props.setShowPlayer(true)
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
      <CContainer className="header control-title">
        <CHeaderBrand>Raspberry list</CHeaderBrand>
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
            <IconButton color="success" onClick={onClickCreateRaspberryButton}>
              <AddCircle />
            </IconButton>
          </CCol>
          <CCol>
            <IconButton
              style={editButtonDisabled ? { color: '#bdbaba' } : { color: '#ff7043' }}
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
            <IconButton
              style={cableButtonDisabled ? { color: '#bdbaba' } : { color: '#7e57c2' }}
              disabled={cableButtonDisabled}
              onClick={onClickCableButton}
            >
              <CableIcon />
            </IconButton>
          </CCol>
          <CCol>
            <IconButton
              style={syncButtonDisabled ? { color: '#bdbaba' } : { color: 'rgb(7 222 233)' }}
              disabled={syncButtonDisabled}
              onClick={onClickSyncButton}
            >
              <CloudSync />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {props.raspberryList.length === 0 ? (
        <div style={{ margin: '22px 0px 0px 21px' }}>
          There is no raspberry. Please create a new raspberry
        </div>
      ) : (
        <div>
          <CListGroup
            className={props.showPlayer ? 'control-listGroup-short' : 'control-listGroup'}
          >
            {props.raspberryList.map((rasp, idx) => (
              <CListGroupItem
                key={idx}
                component="button"
                active={props.selectedRaspberryList.indexOf(rasp.name) > -1}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <CRow>
                  {/* <CCol
                    xs="0"
                    style={{ lineHeight: '40px', width: '35px' }}
                    onClick={() => onClickRaspItem(rasp)}
                  ></CCol> */}
                  <CCol xs="6" style={{ lineHeight: '40px' }} onClick={() => onClickRaspItem(rasp)}>
                    <Checkbox
                      style={{ padding: '0px 10px 0px 1px' }}
                      value={rasp.name}
                      onClick={() => onClickRaspItem(rasp)}
                      checked={props.selectedRaspberryList.indexOf(rasp.name) > -1}
                    />
                    {rasp.name}
                  </CCol>
                  <CCol xs="2" style={{ lineHeight: '40px' }} onClick={() => onClickRaspItem(rasp)}>
                    {rasp.ipAddress}
                  </CCol>
                  <CCol
                    xs="4"
                    style={{ lineHeight: '40px', paddingLeft: '0px', textAlign: 'right' }}
                    // onClick={() => onClickEyeButton(rasp)}
                  >
                    {/* <span style={{ color: 'black' }}>
                      <KeyboardDoubleArrowRightIcon />
                    </span> */}
                    <Tooltip title={rasp.statusMessage}>
                      <span>
                        {(!rasp.currentStatus || rasp.currentStatus === 'Ready') && (
                          <RadioButtonUncheckedIcon style={{ color: '#5a5858' }} />
                        )}
                        {rasp.currentStatus === 'Success' && (
                          <CheckCircleOutlineIcon style={{ color: 'green' }} />
                        )}
                        {rasp.currentStatus === 'Error' && (
                          <RemoveCircleOutlineIcon style={{ color: 'red' }} />
                        )}
                      </span>
                    </Tooltip>
                    <span
                      onClick={() => onShowPlayerButton(rasp)}
                      style={{ color: 'black', marginLeft: '20px' }}
                    >
                      <MusicVideo style={{ color: 'black' }} />
                    </span>
                    <span
                      onClick={() => onClickPlaylistButton(rasp)}
                      style={{ color: 'black', marginLeft: '20px' }}
                    >
                      <CIcon icon={cilFeaturedPlaylist} style={{ color: '#0a009f' }} />
                    </span>
                    <span
                      onClick={() => onClickScheduledSoundButton(rasp)}
                      style={{ color: 'black', marginLeft: '20px' }}
                    >
                      <AccessAlarms style={{ width: '20px', color: 'rgb(243 112 0)' }} />
                    </span>
                  </CCol>
                </CRow>
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>
      )}
      {showRaspModal && (
        <RaspModal
          visible={showRaspModal}
          onClose={() => setshowRaspModal(false)}
          saveRasp={saveRasp}
          raspName={raspName}
          setraspName={setraspName}
          raspIpAddress={raspIpAddress}
          setraspIpAddress={setraspIpAddress}
        />
      )}
    </>
  )
}

export default ListRaspberry
