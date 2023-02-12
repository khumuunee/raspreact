import {
  CButton,
  CCol,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { AccessAlarms, MusicNote, VolumeDown } from '@mui/icons-material'
import { Checkbox } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'

const AllRaspberrysModal = (props) => {
  const [raspList, setRaspList] = useState([])
  const [selectedRaspList, setSelectedRaspList] = useState([])
  const mainContext = useContext(MainContext)

  useEffect(() => {
    if (props.visible) {
      getAllRaspberrys()
      setSelectedRaspList([])
    }
  }, [props.visible])

  const getAllRaspberrys = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/getAllRaspberrys')
      .then((res) => {
        handleResponse(res)
        if (res.data.listRasp) {
          let list = res.data.listRasp.filter(
            (x) => props.raspList.filter((s) => s.name === x.name).length == 0,
          )
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

  const onClickRasp = (name) => {
    if (selectedRaspList.indexOf(name) > -1)
      setSelectedRaspList((prev) => prev.filter((x) => x !== name))
    else setSelectedRaspList((prev) => [...prev, name])
  }

  const handleSelectRaspChange = (event) => {
    const { value, checked } = event.target
    if (checked) {
      setSelectedRaspList((prev) => [...prev, value])
    } else {
      setSelectedRaspList((prev) => prev.filter((x) => x !== value))
    }
  }

  const onClickSelectAll = () => {
    setSelectedRaspList(raspList.map((x) => x.name))
  }

  const onClickSave = () => {
    const selectedSounds = raspList.filter((x) => selectedRaspList.indexOf(x.name) > -1)
    props.addRaspberrysToGroup(selectedSounds)
  }

  return (
    <CModal visible={props.visible} alignment="center" onClose={() => props.onClose()} size="lg">
      <CModalHeader onClose={() => props.onClose()}>
        <CModalTitle>Add raspberrys</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {raspList.length === 0 ? (
          <div>There is no raspberry. Please create raspberry</div>
        ) : (
          <div>
            <CListGroup className="allitemsmodal-listGroup">
              {raspList.map((rasp, idx) => (
                <CListGroupItem
                  key={idx}
                  component="button"
                  onClick={() => onClickRasp(rasp.name)}
                  className="allitemsmodal-listbutton"
                  active={selectedRaspList.indexOf(rasp.name) > -1}
                >
                  <CRow>
                    <CCol xs="10">
                      <Checkbox
                        style={{ padding: '0px 10px 0px 1px' }}
                        value={rasp.name}
                        onChange={handleSelectRaspChange}
                        checked={selectedRaspList.indexOf(rasp.name) > -1}
                      />
                      {rasp.name}
                    </CCol>
                    <CCol xs="2" style={{ textAlign: 'right' }}>
                      {rasp.ipAddress}
                    </CCol>
                  </CRow>
                </CListGroupItem>
              ))}
            </CListGroup>
          </div>
        )}
      </CModalBody>
      <CModalFooter>
        <CRow>
          <CCol xs="1">
            <CButton
              color="success"
              style={{ position: 'absolute', left: '15px' }}
              onClick={onClickSelectAll}
            >
              Select all
            </CButton>
          </CCol>
          <CCol xs="5" style={{ textAlign: 'right' }}>
            <CButton color="primary" onClick={onClickSave}>
              Save
            </CButton>
          </CCol>
          <CCol xs="2">
            <CButton color="secondary" onClick={() => props.onClose()}>
              Cancel
            </CButton>
          </CCol>
        </CRow>
      </CModalFooter>
    </CModal>
  )
}

export default AllRaspberrysModal
