import { CCol, CContainer, CHeaderBrand, CListGroup, CListGroupItem, CRow } from '@coreui/react'
import { FullscreenExit, SavedSearch, Search } from '@mui/icons-material'
import Timeline from '@mui/lab/Timeline'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import { IconButton, TextField, Tooltip } from '@mui/material'
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { useContext, useState } from 'react'
import axiosInstance from 'src/axios-blm'
import MainContext from 'src/context/MainContext'
import { handleError, handleResponse } from 'src/tools/RestServiceTool'

const TimelineContainer = (props) => {
  const [searchDate, setSearchDate] = useState(null)
  const [searched, setSearched] = useState(false)
  const [showLogTimeline, setshowLogTimeline] = useState(true)
  const [logList, setLogList] = useState([])
  const [actionList, setActionList] = useState([])
  const mainContext = useContext(MainContext)

  const onClickCollapseButton = () => {
    props.setShowTimeline(false)
  }

  const getTimelineDotBackgroundColor = (status) => {
    switch (status) {
      case 'played':
        return 'blue'
      case 'finished':
        return 'green'
      case 'stopped':
        return 'gray'
      case 'paused':
        return 'yellow'
      case 'error':
        return 'red'
      default:
        return '#303C54'
    }
  }

  const onClickSearchActionButton = () => {
    setSearched(true)
    setshowLogTimeline(false)
    if (!searchDate) {
      mainContext.showWarningToast('Please select search date')
      return
    }
    const year = '' + searchDate.$y
    let month = '' + (searchDate.$M + 1)
    let day = '' + searchDate.$D
    let date = year + '-' + month + '-' + day
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/searchActionLog', {
        searchDate: date,
      })
      .then((res) => {
        handleResponse(res)
        setActionList(res.data.listAction)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const onClickSearchLogButton = () => {
    setSearched(true)
    setshowLogTimeline(true)
    if (!searchDate) {
      mainContext.showWarningToast('Please select search date')
      return
    }
    const year = '' + searchDate.$y
    let month = '' + (searchDate.$M + 1)
    let day = '' + searchDate.$D
    let date = year + '-' + month + '-' + day
    mainContext.setShowLoader(true)
    axiosInstance
      .post('/searchPlayerLogInRaspberry', {
        searchDate: date,
        raspIpAddress: props.selectedRaspberry.ipAddress,
      })
      .then((res) => {
        handleResponse(res)
        setLogList(res.data.listLog)
      })
      .catch((err) => {
        handleError(err, mainContext)
      })
      .finally(() => {
        mainContext.setShowLoader(false)
      })
  }

  const getTimeFromDate = (date) => {
    return date.split(' ')[1]
  }

  return (
    <div>
      <CContainer className="header control-title">
        <CRow>
          <CCol xs={6}>
            <CHeaderBrand>Timeline</CHeaderBrand>
          </CCol>
          <CCol xs={6} style={{ textAlign: 'right' }}>
            <CHeaderBrand>{props.selectedRaspberry.name}</CHeaderBrand>
          </CCol>
        </CRow>
      </CContainer>
      <CContainer className="header control-header">
        <CRow xs={{ cols: 'auto' }}>
          <CCol>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="YYYY/MM/DD"
                value={searchDate}
                onChange={setSearchDate}
                renderInput={(params) => (
                  <TextField {...params} size="small" style={{ width: '145px' }} />
                )}
              />
            </LocalizationProvider>
          </CCol>
          <CCol>
            <Tooltip title="Search log">
              <IconButton style={{ color: '#3C4B64' }} onClick={onClickSearchLogButton}>
                <Search />
              </IconButton>
            </Tooltip>
          </CCol>
          <CCol>
            <Tooltip title="Search action">
              <IconButton style={{ color: '#3C4B64' }} onClick={onClickSearchActionButton}>
                <SavedSearch />
              </IconButton>
            </Tooltip>
          </CCol>
          <CCol style={{ position: 'absolute', right: '0px' }}>
            <IconButton style={{ color: 'black' }} onClick={onClickCollapseButton}>
              <FullscreenExit />
            </IconButton>
          </CCol>
        </CRow>
      </CContainer>
      {searched ? (
        showLogTimeline ? (
          <>
            {logList.length === 0 ? (
              <div style={{ margin: '22px 0px 0px 21px' }}>No logs found.</div>
            ) : (
              <div>
                <Timeline position="left" className="control-listGroup">
                  {logList.map((log, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineOppositeContent color="text.secondary">
                        {log.soundName}
                      </TimelineOppositeContent>
                      <TimelineSeparator>
                        <TimelineDot
                          style={{
                            backgroundColor: `${getTimelineDotBackgroundColor(log.status)}`,
                          }}
                        />
                        <TimelineConnector sx={{ height: '5px' }} />
                      </TimelineSeparator>
                      <TimelineContent>
                        <span style={{ position: 'relative', top: '25px', right: '-63px' }}>
                          {log.status}
                        </span>
                        <span>{getTimeFromDate(log.time)}</span>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            )}
          </>
        ) : (
          <>
            {actionList.length === 0 ? (
              <div style={{ margin: '22px 0px 0px 21px' }}>No actions found</div>
            ) : (
              <div>
                <CListGroup
                  className={props.showPlayer ? 'control-listGroup-short' : 'control-listGroup'}
                >
                  {actionList.map((action, idx) => (
                    <CListGroupItem key={idx}>
                      <CRow>
                        <CCol xs="6" style={{ textAlign: 'left' }}>
                          {action.actionName}
                        </CCol>
                        <CCol xs="3" style={{ textAlign: 'right' }}>
                          {action.remoteAddress}
                        </CCol>
                        <CCol xs="3" style={{ textAlign: 'right' }}>
                          {action.actionDate}
                        </CCol>
                      </CRow>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </div>
            )}
          </>
        )
      ) : (
        <div style={{ margin: '22px 0px 0px 21px' }}>Search logs</div>
      )}
    </div>
  )
}

export default TimelineContainer
