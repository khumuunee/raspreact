import { CCol, CRow } from '@coreui/react'
import { useState } from 'react'
import WidgetsBrand from '../widgets/WidgetsBrand'
import TimelineContainer from './timeline/TimelineContainer'

const Dashboard = () => {
  const [showTimeline, setShowTimeline] = useState(false)
  const [raspberryList, setraspberryList] = useState([])
  const [selectedRaspberry, setselectedRaspberry] = useState(null)

  return (
    <CRow>
      <CCol xs={showTimeline ? 6 : 12}>
        <WidgetsBrand
          setShowTimeline={setShowTimeline}
          showTimeline={showTimeline}
          raspberryList={raspberryList}
          setraspberryList={setraspberryList}
          setselectedRaspberry={setselectedRaspberry}
        />
      </CCol>
      {showTimeline && (
        <CCol xs={6}>
          <TimelineContainer
            setShowTimeline={setShowTimeline}
            selectedRaspberry={selectedRaspberry}
          />
        </CCol>
      )}
    </CRow>
  )
}

export default Dashboard
