import React, { useContext, useEffect, useState } from 'react'

import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { Tab, Tabs } from '@mui/material'
import Box from '@mui/material/Box'
import { useParams } from 'react-router-dom'
import './blockmodeltable.scss'
import DataTable from './DataTable/DataTable'
import Script from './Script/Script'
import Paraview from './Paraview/Paraview'
import MainContext from 'src/context/MainContext'
import axiosInstance from 'src/axios-blm'

const BlockModelTable = () => {
  const { blockModelId } = useParams()
  const [header, setHeader] = useState('')
  const [value, setValue] = React.useState('one')
  const mainContext = useContext(MainContext)
  const [iframeState, setIframeState] = useState(0)
  const [frameSrc, setFrameSrc] = useState('')
  const [showIFrame, setShowIFrame] = useState(false)

  const resetIframe = () => {
    setIframeState(iframeState + 1)
  }

  useEffect(() => {
    const paraviewAddress = sessionStorage.getItem('frameSrc')
    if (paraviewAddress) {
      resetIframe()
      setFrameSrc(paraviewAddress)
      setShowIFrame(true)
    }
  }, [])

  useEffect(() => {
    let item = sessionStorage.getItem('tables')
    if (item) {
      let tables = JSON.parse(item)
      if (tables && tables.length != 0) {
        let table = tables.find((item) => item.id === blockModelId)
        if (table) {
          let name = table.name
          setHeader(name)
        }
      }
      setValue('one')
    }
  }, [blockModelId])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const getClassName = (componentName) => {
    if (componentName === 'table') {
      if (value === 'one') return undefined
      else return 'hidden'
    }
    if (componentName === 'script') {
      if (value === 'two') return undefined
      else return 'hidden'
    }
    if (componentName === 'paraview') {
      if (value === 'three') return undefined
      else return 'hidden'
    }
  }

  const startParaview = () => {
    let isNeedClearInterval = true
    axiosInstance.post(`/startParaview`, { tableName: blockModelId }).then((response) => {
      if (response.data.result === 'Running') return
      const paraviewAddress = 'http://localhost:' + response.data.portNumber + '/index.html'
      var checkParaviewStatusTimer = window.setInterval(function () {
        axiosInstance.get('/getParaviewStatus?tableName=' + blockModelId).then((res) => {
          if (res.data === 'Ready') {
            clearInterval(checkParaviewStatusTimer)
            isNeedClearInterval = false
            setTimeout(function () {
              resetIframe()
              setFrameSrc(paraviewAddress)
              setShowIFrame(true)
              sessionStorage.setItem('frameSrc', paraviewAddress)
            }, 2000)
          }
        })
      }, 2000)

      if (isNeedClearInterval)
        setTimeout(function () {
          clearInterval(checkParaviewStatusTimer)
        }, 300000)
    })
  }

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>{header}</CCardHeader>
          <CCardBody>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
                <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
                  <Tab value="one" label="DATA TABLE" />
                  <Tab value="two" label="SCRIPTS" />
                  <Tab value="three" label="3D VISUALIZATION" onClick={startParaview} />
                </Tabs>
              </Box>
              <div className={getClassName('table')}>
                <DataTable />
              </div>
              <div className={getClassName('script')}>
                <Script />
              </div>
              <div className={getClassName('paraview')}>
                <Paraview iframeState={iframeState} showIFrame={showIFrame} frameSrc={frameSrc} />
              </div>
            </Box>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BlockModelTable
