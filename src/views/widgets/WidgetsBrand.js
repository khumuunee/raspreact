import { CCol, CContainer, CHeaderBrand, CRow } from '@coreui/react'
import { AccessAlarms, MusicNote, VolumeDown } from '@mui/icons-material'
import { Card, CardActionArea, Tooltip } from '@mui/material'
import { useContext, useEffect } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { sortBy } from 'src/tools/BaseTool'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'
import './css/widget.scss'

const WidgetsBrand = (props) => {
  const mainContext = useContext(MainContext)

  useEffect(() => {
    loadRaspberryListForDashboard()
  }, [])

  const loadRaspberryListForDashboard = () => {
    mainContext.setShowLoader(true)
    axiosInstance
      .get('/loadRaspberryListForDashboard')
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

  const onclickActionArea = (rasp) => {
    props.setShowTimeline(true)
    props.setselectedRaspberry(rasp)
  }

  // const arr = [1, 2, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6, 6, 7, 7]
  const arr = [1, 2, 3, 4, 4, 4, 4, 4]

  const getBodyTopBackgroundColor = (x) => {
    switch (x.id) {
      case 1:
        return 'rgb(249, 177, 21)'
        break
      case 2:
        return '#321FDB'
        break
      case 3:
        return 'rgb(51,153,255)'
        break
      case 4:
        return 'rgb(229,83,83)'
        break
      case 5:
        return 'rgb(46,184,92)'
        break
      case 6:
        return 'rgb(156,39,176)'
        break
      case 7:
        return 'rgb(21 249 249)'
        break
      default:
        return 'rgb(249, 177, 21)'
    }
  }

  return (
    <>
      <CRow className="widget-body-top-row">
        {props.raspberryList.map((rasp, idx) => (
          <CCol key={idx} xs={props.showTimeline ? 6 : 3} style={{ marginBottom: '20px' }}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea onClick={() => onclickActionArea(rasp)}>
                <div
                  className="widget-body-top"
                  style={{ background: `${getBodyTopBackgroundColor(rasp)}` }}
                >
                  {rasp.name}
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
