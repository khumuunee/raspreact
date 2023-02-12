import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CModal,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CToast,
  CToastBody,
  CToastClose,
  CToastHeader,
} from '@coreui/react'
import { AddCircle } from '@mui/icons-material'

import DeleteIcon from '@mui/icons-material/Delete'
import PlayCircleFilledWhite from '@mui/icons-material/PlayCircleFilledWhite'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useContext, useEffect, useState } from 'react'
import axios from '../../../axios-blm'
import MainContext from '../../../context/MainContext'
import './script.scss'
import SelectScripts from './Select/SelectScripts'

const Script = () => {
  const mainContext = useContext(MainContext)
  const [showModal, setShowModal] = useState(false)
  const [scriptName, setScriptName] = useState('') //khadgalj bui scriptiin ner
  const [warningToastVisible, setWarningToastVisible] = useState(false)
  const [savedScriptNames, setSavedScriptNames] = useState([])
  const [warningText, setWarningText] = useState('')
  const [warningMainToastVisible, setWarningMainToastVisible] = useState(false)
  const [warningMainText, setWarningMainText] = useState('')
  const [successToastText, setSuccessToastText] = useState('')
  const [successToastVisible, setSuccessToastVisible] = useState(false)
  const [selectedScriptNames, setSelectedScriptNames] = useState([])

  const getSavedScriptNames = () => {
    axios.get('/getSavedScriptNames').then((res) => setSavedScriptNames(res.data))
  }

  useEffect(() => {
    getSavedScriptNames()
  }, [])

  const runScrpit = () => {
    axios
      .post(`/runPythonScript`, { text: mainContext.allValue.textEditorValue })
      .then((khariu) => {
        mainContext.setOutputValue(khariu.data)
      })
  }

  const addScript = () => {
    if (mainContext.allValue.textEditorValue === '') {
      setWarningMainText('Please write script')
      setWarningMainToastVisible(true)
      return
    }
    setShowModal(true)
  }

  const saveScript = () => {
    if (scriptName === '') {
      setWarningToastVisible(true)
      setWarningText('Please insert script name')
      return
    }
    let currentName = scriptName.replaceAll(' ', '').toLowerCase()
    let isDuplicate = false
    for (const x of savedScriptNames) {
      let name = x.replaceAll(' ', '').toLowerCase()
      if (name === currentName) {
        isDuplicate = true
        break
      }
    }
    if (isDuplicate) {
      setWarningToastVisible(true)
      setWarningText('Duplicate name')
      return
    }
    axios
      .post(`/savePythonScript`, { name: scriptName, script: mainContext.allValue.textEditorValue })
      .then((res) => {
        if (res.data === 'Success') {
          setSavedScriptNames([...savedScriptNames, scriptName])
          setShowModal(false)
          setSuccessToastText('Script saved successfully')
          setSuccessToastVisible(true)
        }
      })
  }

  const clearOutput = () => {
    mainContext.setOutputValue('')
  }

  const clearTextEditor = () => {
    mainContext.setTextEditorValue('')
    setSelectedScriptNames([])
  }

  const deleteScript = (scriptName) => {
    axios.post('/deleteScript', { scriptName: scriptName }).then((res) => {
      if (res.data === 'Success') {
        getSavedScriptNames()
        setSuccessToastText('Script deleted successfully')
        setSuccessToastVisible(true)
      }
    })
  }

  const onClickMenuItem = (event, clickedScriptName, isChecked) => {
    clearTextEditor()
    if (!isChecked) {
      axios.post('/getScriptBody/', { scriptName: clickedScriptName }).then((res) => {
        mainContext.setTextEditorValue(res.data)
        setSelectedScriptNames([clickedScriptName])
      })
    }
  }

  return (
    <>
      <CRow className="scriptRow">
        <CCol lg={8}>
          <CCard>
            <CCardHeader>Script editor</CCardHeader>
            <Stack direction="row" spacing={1} className="stack">
              <IconButton onClick={runScrpit} style={{ color: 'green' }}>
                <PlayCircleFilledWhite />
              </IconButton>
              <IconButton
                onClick={clearTextEditor}
                color="primary"
                aria-label="add to shopping cart"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton onClick={addScript} style={{ color: '#f18414' }}>
                <AddCircle />
              </IconButton>
              <SelectScripts
                savedScriptNames={savedScriptNames}
                setSavedScriptNames={setSavedScriptNames}
                deleteScript={deleteScript}
                selectedScriptNames={selectedScriptNames}
                setSelectedScriptNames={setSelectedScriptNames}
                onClickMenuItem={onClickMenuItem}
              ></SelectScripts>
            </Stack>
            <CCardBody className="scriptbody">
              <TextField
                placeholder="Write scripts..."
                multiline
                className="textField"
                rows={15}
                value={mainContext.allValue.textEditorValue}
                onChange={(event) => mainContext.setTextEditorValue(event.target.value)}
              />
            </CCardBody>
          </CCard>
        </CCol>
        <CCol lg={4}>
          <CCard>
            <CCardHeader>Script output</CCardHeader>
            <Stack direction="row" spacing={1} className="stack">
              <IconButton onClick={clearOutput} color="primary" aria-label="add to shopping cart">
                <DeleteIcon />
              </IconButton>
            </Stack>
            <CCardBody className="scriptbody" s>
              <TextField
                placeholder="Output"
                multiline
                className="textField"
                rows={15}
                value={mainContext.allValue.ouputValue}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CModal alignment="center" visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader>
          <CModalTitle>Save script</CModalTitle>
        </CModalHeader>
        <br />
        <CRow className="mb-3">
          <CFormLabel
            htmlFor="inputPassword"
            className="col-sm-4 col-form-label"
            style={{ marginLeft: '20px' }}
          >
            Script name:
          </CFormLabel>
          <div className="col-sm-7">
            <CFormInput
              type="text"
              placeholder="Please insert script name..."
              aria-label="Script name..."
              value={scriptName}
              onChange={(event) => setScriptName(event.target.value)}
              required
            />
          </div>
        </CRow>
        <br />
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
          <CButton onClick={saveScript} color="primary">
            Save
          </CButton>
        </CModalFooter>
        <CToast
          autohide={false}
          className="align-items-center"
          visible={warningToastVisible}
          style={{
            top: '50%',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <CToastHeader>
            <svg
              className="rounded me-2"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
              role="img"
            >
              <rect width="100%" height="100%" fill="rgb(235 96 50)"></rect>
            </svg>
            <strong className="me-auto">Warning</strong>
            <button
              type="button"
              class="btn btn-close"
              aria-label="Close"
              onClick={() => setWarningToastVisible(false)}
            ></button>
          </CToastHeader>
          <CToastBody>{warningText}</CToastBody>
        </CToast>
      </CModal>
      <CToast
        autohide={false}
        className="align-items-center"
        visible={warningMainToastVisible}
        style={{
          top: '50%',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CToastHeader>
          <svg
            className="rounded me-2"
            width="20"
            height="20"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
            role="img"
          >
            <rect width="100%" height="100%" fill="rgb(235 96 50)"></rect>
          </svg>
          <strong className="me-auto">Warning</strong>
          <button
            type="button"
            class="btn btn-close"
            aria-label="Close"
            onClick={() => setWarningMainToastVisible(false)}
          ></button>
        </CToastHeader>
        <CToastBody>{warningMainText}</CToastBody>
      </CToast>
      <CToast
        autohide={true}
        className="text-white align-items-center"
        visible={successToastVisible}
        style={{
          right: '0px',
          position: 'absolute',
          backgroundColor: 'green',
        }}
        onClose={() => setSuccessToastVisible(false)}
      >
        <div className="d-flex">
          <CToastBody>{successToastText}</CToastBody>
          <CToastClose
            className="me-2 m-auto"
            white
            onClick={() => setSuccessToastVisible(false)}
          />
        </div>
      </CToast>
    </>
  )
}

export default Script
