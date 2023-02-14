import { CCol, CRow } from '@coreui/react'
import { AccessAlarms, MusicNote, PauseCircle, PlayCircle, VolumeDown } from '@mui/icons-material'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import { Card, CardActionArea, Tooltip } from '@mui/material'
import { useContext, useEffect } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortByMultiple } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import './css/widget.scss'

const WidgetsBrand = (props) => {
  const mainContext = useContext(MainContext)

  useEffect(() => {
    loadRaspberryListForDashboard()
  }, [])

  useEffect(() => {
    getPlayerStatus()
  }, [mainContext.statusCounter])

  const loadRaspberryListForDashboard = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/loadRaspberryListForDashboard')
      .then((res) => {
        handleResponse(res)
        if (res.data.listRasp) {
          let list = res.data.listRasp
          for (let x of list) {
            if (x.groupId === null) x.groupId = ''
          }
          list = list.sort(sortByMultiple(['groupId', 'name']))
          mainContext.setraspberryList(list)
          mainContext.setStatusCounter(mainContext.statusCounter + 1)
        } else mainContext.setraspberryList([])
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const getPlayerStatus = () => {
    if (mainContext.statusCounter === -1) return
    if (mainContext.statusCounter === -2) {
      if (mainContext.raspberryList.length === 0) {
        mainContext.setStatusCounter(-1)
        return
      }
      let list = mainContext.raspberryList
      for (let item of list) {
        item.currentStatus = 'empty'
      }
      mainContext.setraspberryList(list)
      mainContext.setStatusCounter(0)
      return
    }
    mainContext.raspberryList[mainContext.statusCounter]
    axiosInstance
      .post('/getCurrentPlayerStatusFromRaspberry', {
        raspIpAddress:
          mainContext.raspberryList[mainContext.statusCounter].ipAddress + 'SPLITFROMHERE',
      })
      .then((res) => {
        handleResponse(res)
        mainContext.raspberryList[mainContext.statusCounter].currentStatus = '' + res.data.isPlaying
      })
      .catch((err) => {
        mainContext.raspberryList[mainContext.statusCounter].currentStatus = 'error'
      })
      .finally(() => {
        if (mainContext.statusCounter === mainContext.raspberryList.length - 1)
          mainContext.setStatusCounter(-1)
        else mainContext.setStatusCounter(mainContext.statusCounter + 1)
      })
  }

  const onclickActionArea = (rasp) => {
    props.setShowTimeline(true)
    props.setselectedRaspberry(rasp)
  }

  const getBodyTopBackgroundColor = (rasp) => {
    const list123 = mainContext.raspberryList
      .filter((x) => x.groupId !== null)
      .map((x) => x.groupId)
    const uniq = [...new Set(list123)]
    const index = uniq.indexOf(rasp.groupId)
    switch (index) {
      case 0:
        return 'rgb(249, 177, 21)'
        break
      case 1:
        return '#321FDB'
        break
      case 2:
        return 'rgb(51,153,255)'
        break
      case 3:
        return 'rgb(229,83,83)'
        break
      case 4:
        return 'rgb(46,184,92)'
        break
      case 5:
        return 'rgb(156,39,176)'
        break
      case 6:
        return 'rgb(21 249 249)'
        break
      default:
        return 'rgb(21 249 249)'
    }
  }

  return (
    <>
      <CRow className="widget-body-top-row">
        {mainContext.raspberryList.map((rasp, idx) => (
          <CCol key={idx} xs={props.showTimeline ? 6 : 3} style={{ marginBottom: '20px' }}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea onClick={() => onclickActionArea(rasp)}>
                <div>
                  {rasp.currentStatus === 'empty' && (
                    <div style={{ color: 'black', fontSize: '16px', textAlign: 'center' }}>
                      loading...
                    </div>
                  )}
                  {rasp.currentStatus === 'error' && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: 'red', fontSize: '16px' }}>not connected</span>
                    </div>
                  )}
                  {rasp.currentStatus === 'true' && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: 'green', fontSize: '16px' }}>playing</span>
                    </div>
                  )}
                  {rasp.currentStatus === 'false' && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ color: 'orange', fontSize: '16px' }}>stopped</span>
                    </div>
                  )}
                </div>
                <div
                  className="widget-body-top"
                  style={{ background: `${getBodyTopBackgroundColor(rasp)}` }}
                >
                  <div>{rasp.name}</div>
                </div>
                <CRow className="widget-body-row">
                  <Tooltip title="Song">
                    <CCol xs="4" className="widget-body-col">
                      <MusicNote color="primary" />
                      <span> {rasp.songCount}</span>
                    </CCol>
                  </Tooltip>
                  <div className="vr"></div>
                  <Tooltip title="Ad">
                    <CCol xs="4" className="widget-body-col">
                      <VolumeDown color="secondary" />
                      <span> {rasp.adCount}</span>
                    </CCol>
                  </Tooltip>
                  <div className="vr"></div>
                  <Tooltip title="Scheduled sound">
                    <CCol xs="3" className="widget-body-col">
                      <AccessAlarms style={{ color: 'rgb(243, 112, 0)', fontSize: '20px' }} />
                      <span> {rasp.scheduledSoundCount}</span>
                    </CCol>
                  </Tooltip>
                </CRow>
              </CardActionArea>
            </Card>
          </CCol>
        ))}
      </CRow>
    </>
  )
}

export default WidgetsBrand
