// Tab ajilj baigaa jishee

import React from 'react'

import PropTypes from 'prop-types'
import { useParams } from 'react-router-dom'
import { CRow, CCol, CCard, CCardBody, CCardHeader } from '@coreui/react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DataTable from './DataTable/DataTable'
import './blockmodeltable.scss'
import Script from './Script/Script'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }} className="box">
          <Typography hidden={value !== index} component={'span'}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const BlockModelTable = () => {
  const [value, setValue] = React.useState(0)
  const { blockModelId } = useParams()

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader>Block model {blockModelId}</CCardHeader>
          <CCardBody>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Data table" {...a11yProps(0)} />
                  <Tab label="Scripts" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <DataTable />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Script />
              </TabPanel>
            </Box>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BlockModelTable
