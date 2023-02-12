import { cilFace, cilFrown, cilHappy, cilMagnifyingGlass } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CCol,
  CContainer,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CListGroup,
  CListGroupItem,
  CRow,
} from '@coreui/react'
import { useContext, useEffect, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'

const UploadSounds = () => {
  const [soundList, setSoundList] = useState([])
  const [index, setIndex] = useState(-1)
  const [hasError, setHasError] = useState(false)
  const [soundType, setsoundType] = useState('Please select sound type')
  const mainContext = useContext(MainContext)

  const selectFiles = (e) => {
    if (e.target.files.length == 0) return
    let list = []
    for (let i = 0; i < e.target.files.length; i++) {
      let sound = e.target.files[i]
      sound.currentStatus = 'Ready'
      list.push(sound)
    }
    setSoundList(list)
  }

  const uploadFiles = () => {
    if (soundList.length === 0) {
      mainContext.showWarningToast('Please select the files')
      return
    }
    if (soundType === 'Please select sound type') {
      mainContext.showWarningToast('Please select sound type')
      return
    }
    mainContext.setShowLoader(true)
    setHasError(false)
    setIndex(0)
  }

  useEffect(() => {
    if (index != -1) uploadFile()
  }, [index])

  const uploadFile = () => {
    let list = [...soundList]
    const formData = new FormData()
    formData.append('file', soundList[index], soundList[index].name)
    formData.append('soundType', soundType)
    axiosInstance
      .post(`/uploadSound`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((response) => {
        list[index].currentStatus = response.data.RES_CODE
        setSoundList(list)
        if (response.data.RES_CODE === 'Error') setHasError(true)
        if (index == soundList.length - 1) {
          setIndex(-1)
          mainContext.setShowLoader(false)
          if (hasError || response.data.RES_CODE === 'Error')
            mainContext.showErrorToast('Something went wrong', true)
          else mainContext.showSuccessToast('Successfully saved', true)
        } else {
          let idx = index
          idx++
          setIndex(idx)
        }
      })
  }

  const onChangeSoundType = (e) => {
    setsoundType(e.target.value)
  }

  return (
    <div className="bg-light  d-flex flex-row align-items-center">
      {
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={6}>
              <div className="clearfix">
                <h4 className="pt-3">Please select the files</h4>
                <p className="text-medium-emphasis float-start">File format must be mp3</p>
              </div>
              <CInputGroup className="input-prepend">
                <CInputGroupText>
                  <CIcon icon={cilMagnifyingGlass} />
                </CInputGroupText>
                <CFormInput
                  type="file"
                  id="formFileMultiple"
                  multiple
                  onChange={selectFiles}
                  accept=".mp3,audio/mpeg"
                />
                <CButton color="info" onClick={uploadFiles}>
                  Upload
                </CButton>
              </CInputGroup>
              <br />
              <CFormSelect
                onChange={onChangeSoundType}
                value={soundType}
                options={[
                  'Please select sound type',
                  { label: 'Song', value: 'Song' },
                  { label: 'Ad', value: 'Ad' },
                  { label: 'Scheduled sound', value: 'ScheduledSound' },
                ]}
              />
              <br />
              <CListGroup>
                {soundList.map((sound, idx) => (
                  <CListGroupItem key={idx}>
                    {sound.name}
                    {sound.currentStatus === 'Ready' && (
                      <CIcon icon={cilFace} size="xl" style={{ float: 'right' }} />
                    )}
                    {sound.currentStatus === 'Success' && (
                      <CIcon icon={cilHappy} size="xl" style={{ float: 'right', color: 'green' }} />
                    )}
                    {sound.currentStatus === 'Error' && (
                      <CIcon icon={cilFrown} size="xl" style={{ float: 'right', color: 'red' }} />
                    )}
                  </CListGroupItem>
                ))}
              </CListGroup>
            </CCol>
          </CRow>
        </CContainer>
      }
    </div>
  )
}

export default UploadSounds
