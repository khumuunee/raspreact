import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { AccessAlarms, AddCircle, Edit } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import { IconButton } from '@mui/material'
import Checkbox from '@mui/material/Checkbox'
import dayjs from 'dayjs'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import AllRaspberrysModal from '../allraspberrysmodal/AllRaspberrysModal'

const ListRaspberryInGroup = (props) => {
  const [selectAll, setSelectAll] = useState(false)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  const [raspList, setRaspList] = useState([])
  const [selectedRaspList, setSelectedRaspList] = useState([])
  const [showAllRaspberrysModal, setShowAllRaspberrysModal] = useState(false)
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.showRaspberrys) loadRaspberrys()
    else {
      setRaspList([])
    }
    setSelectedRaspList([])
  }, [props.showRaspberrysCounter])

  useEffect(() => {
    setDeleteButtonDisabled(selectedRaspList.length == 0)
  }, [selectedRaspList])

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked)
    if (event.target.checked) setSelectedRaspList(raspList.map((s) => s.name))
    else setSelectedRaspList([])
  }

  const handleSelectRaspChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedRaspList((prev) => [...prev, value])
    } else {
      setSelectedRaspList((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickRasp = (name) => {
    if (selectedRaspList.indexOf(name) > -1)
      setSelectedRaspList((prev) => prev.filter((x) => x !== name))
    else setSelectedRaspList((prev) => [...prev, name])
  }

  const loadRaspberrys = () => {
    mainContext.setShowLoader(true)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    axiosInstance
      .get('/loadRaspberrysInGroup/' + groupId)
      .then((res) => {
        handleResponse(res)
        if (res.data.listRasp) {
          let list = res.data.listRasp
          list = list.sort(sortBy('name'))
          setRaspList(list)
        } else setRaspList([])
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
      'Remove raspberrys',
      'Are sure remove raspberry from the group?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    axiosInstance
      .post('/removeRaspberrysFromGroup', { raspberryNames: selectedRaspList, groupId: groupId })
      .then((res) => {
        handleResponse(res)
        if (res.data.listRasp) {
          let list = res.data.listRasp
          list = list.sort(sortBy('name'))
          setRaspList(list)
        } else setRaspList([])
        setSelectedRaspList([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickAddRaspberrys = () => {
    if (props.selectedGroup.length != 1) {
      mainContext.showWarningToast('Please select a group')
      return
    }
    setShowAllRaspberrysModal(true)
  }

  const onCloseAllRaspberrysModal = () => {
    setShowAllRaspberrysModal(false)
  }

  const addRaspberrysToGroup = (addedRaspList) => {
    if (addedRaspList.length == 0) {
      mainContext.showWarningToast('Please select the raspberrys')
      return
    }
    setShowAllRaspberrysModal(false)
    const groupId =
      props.grouplist[props.grouplist.map((x) => x.name).indexOf(props.selectedGroup[0])].id
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/addRaspberrysToGroup', {
        groupId: groupId,
        addedRaspList: addedRaspList,
      })
      .then((res) => {
        handleResponse(res)
        loadRaspberrys()
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
      <CContainer className="header control-title">
        <CHeaderBrand>Raspberrys</CHeaderBrand>
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
            <IconButton
              color="success"
              onClick={onClickAddRaspberrys}
              disabled={!props.showRaspberrys}
            >
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
        </CRow>
      </CContainer>
      {props.showRaspberrys ? (
        <>
          {raspList.length === 0 ? (
            <div style={{ margin: '22px 0px 0px 21px' }}>
              There is no raspberrys. Please add raspberry
            </div>
          ) : (
            <div>
              <CListGroup className="control-listGroup">
                {raspList.map((rasp, idx) => (
                  <CListGroupItem
                    key={idx}
                    component="button"
                    onClick={() => onClickRasp(rasp.name)}
                    active={selectedRaspList.indexOf(rasp.name) > -1}
                  >
                    <CRow>
                      <CCol xs="8">
                        <Checkbox
                          style={{ padding: '0px 10px 0px 1px' }}
                          value={rasp.name}
                          onChange={handleSelectRaspChange}
                          checked={selectedRaspList.indexOf(rasp.name) > -1}
                        />
                        {rasp.name}
                      </CCol>
                      <CCol xs="4">{rasp.ipAddress}</CCol>
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
            Click on the arrow icon to view the raspberrys
          </div>
        </>
      )}
      {showAllRaspberrysModal && (
        <AllRaspberrysModal
          visible={showAllRaspberrysModal}
          onClose={onCloseAllRaspberrysModal}
          addRaspberrysToGroup={addRaspberrysToGroup}
          raspList={raspList}
        />
      )}
    </div>
  )
}

export default ListRaspberryInGroup
