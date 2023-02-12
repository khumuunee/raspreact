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
import CreateGroupModal from '../creategroupmodal/CreateGroupModal'

const ListGroup = (props) => {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectAll, setSelectAll] = useState(false)
  const [editButtonDisabled, setEditButtonDisabled] = useState(true)
  const [deleteButtonDisabled, setDeleteButtonDisabled] = useState(true)
  //CreateGroupModal duudahdaa create esvel edit button daragdaj duudagdaj baigaa. Tuuniig yalgah zorilgoor avlaa
  const [clickedButtonName, setClickedButtonName] = useState('')
  const mainContext = useContext(MainContext)

  useEffect(() => {
    loadGroups()
  }, [])

  useEffect(() => {
    setEditButtonDisabled(props.selectedGroup.length != 1)
    setDeleteButtonDisabled(props.selectedGroup.length == 0)
  }, [props.selectedGroup])

  useEffect(() => {
    if (props.grouplist.length == 0) {
      setEditButtonDisabled(true)
      setDeleteButtonDisabled(true)
      setSelectAll(false)
    }
  }, [props.grouplist])

  const loadGroups = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/loadScheduledSoundGroups')
      .then((res) => {
        handleResponse(res)
        if (res.data.groups) {
          let list = res.data.groups
          list = list.sort(sortBy('name'))
          props.setGrouplist(list)
        } else props.setGrouplist([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickCreateGroup = () => {
    setGroupName('')
    setShowCreateModal(true)
    setClickedButtonName('create')
  }

  const onCloseCreateGroupModal = () => {
    setShowCreateModal(false)
  }

  const saveGroup = () => {
    if (!groupName || removeAllWhiteSpace(groupName).length == 0) {
      mainContext.showWarningToast('Please enter the name', true)
      return
    }
    if (clickedButtonName === 'create') createNewGroup()
    else updateGroup()
  }
  const createNewGroup = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/saveScheduledSoundGroup', { groupName: groupName })
      .then((res) => {
        handleResponse(res)
        setShowCreateModal(false)
        loadGroups()
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }
  const updateGroup = () => {
    if (props.selectedGroup[0].trim() === groupName.trim()) {
      setShowCreateModal(false)
      return
    }
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/updateScheduledSoundGroup', {
        oldName: props.selectedGroup[0],
        newName: groupName.trim(),
      })
      .then((res) => {
        handleResponse(res)
        setShowCreateModal(false)
        let list = props.grouplist
        list[list.map((x) => x.name).indexOf(props.selectedGroup[0])].name = groupName.trim()
        props.setGrouplist(list)
        props.setSelectedGroup([groupName.trim()])
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
    if (event.target.checked) props.setSelectedGroup(props.grouplist.map((x) => x.name))
    else props.setSelectedGroup([])
  }

  const handleSelectGroupChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      props.setSelectedGroup((prev) => [...prev, value])
    } else {
      props.setSelectedGroup((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickGroup = (playlist) => {
    if (props.selectedGroup.indexOf(playlist.name) > -1)
      props.setSelectedGroup((prev) => prev.filter((x) => x !== playlist.name))
    else props.setSelectedGroup((prev) => [...prev, playlist.name])
  }

  const onClickEditButton = () => {
    setGroupName(props.selectedGroup[0])
    setShowCreateModal(true)
    setClickedButtonName('edit')
  }

  const onClickDeleteButton = () => {
    mainContext.showModal(
      'Delete group',
      'Are sure delete scheduled sound group?',
      onClickDeleteButtonYes,
    )
  }

  const onClickDeleteButtonYes = () => {
    mainContext.setShowLoader(true)
    const ids = props.grouplist
      .filter((x) => props.selectedGroup.indexOf(x.name) !== -1)
      .map((x) => x.id)
    axiosInstance
      .post('/deleteScheduledSoundGroups', ids)
      .then((res) => {
        handleResponse(res)
        props.setGrouplist(
          props.grouplist
            .filter((x) => props.selectedGroup.indexOf(x.name) === -1)
            .sort(sortBy('name')),
        )
        props.setSelectedGroup([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickEyeButton = (playlist) => {
    props.setSelectedGroup([playlist.name])
    props.onClickViewButton()
  }

  return (
    <>
      <CContainer className="header control-title" style={{ background: '#f5ac6e' }}>
        <CHeaderBrand>Group list</CHeaderBrand>
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
            <IconButton color="success" onClick={onClickCreateGroup}>
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
      {props.grouplist.length === 0 ? (
        <div style={{ margin: '22px 0px 0px 21px' }}>
          There is no scheduled sound group. Please create a new group
        </div>
      ) : (
        <div>
          <CListGroup className="control-listGroup">
            {props.grouplist.map((group, idx) => (
              <CListGroupItem
                key={idx}
                component="button"
                active={props.selectedGroup.indexOf(group.name) > -1}
                style={{ paddingTop: '0px', paddingBottom: '0px' }}
              >
                <CRow>
                  <CCol xs="1" style={{ lineHeight: '40px' }}>
                    <Checkbox
                      style={{ padding: '0px 10px 0px 1px' }}
                      value={group.name}
                      onChange={handleSelectGroupChange}
                      checked={props.selectedGroup.indexOf(group.name) > -1}
                    />
                  </CCol>
                  <CCol xs="10" style={{ lineHeight: '40px' }} onClick={() => onClickGroup(group)}>
                    {group.name}
                  </CCol>
                  <CCol
                    xs="1"
                    style={{ lineHeight: '40px', paddingLeft: '0px' }}
                    onClick={() => onClickEyeButton(group)}
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
        <CreateGroupModal
          visible={showCreateModal}
          onClose={onCloseCreateGroupModal}
          saveGroup={saveGroup}
          name={groupName}
          setName={setGroupName}
        />
      )}
    </>
  )
}

export default ListGroup
