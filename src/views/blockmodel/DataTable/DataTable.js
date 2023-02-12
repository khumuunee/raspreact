import { DataGrid } from '@mui/x-data-grid'

import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from '../../../axios-blm'
import MainContext from '../../../context/MainContext'
import { userColumns } from '../../../datatablesource'
import './datatable.scss'

const DataTable = () => {
  const mainContext = useContext(MainContext)
  const { blockModelId } = useParams()

  // useEffect(() => {
  //   console.log('first')
  //   const tableData = sessionStorage.getItem('tableData')
  //   if (tableData) mainContext.setTableData(tableData)
  // }, [])

  useEffect(() => {
    axios.get(`/getBlockModelData`).then((khariu) => {
      mainContext.setTableData(khariu.data)
      // console.log('data', khariu.data)
      // sessionStorage.setItem('tableData', khariu.data)
    })
  }, [blockModelId])

  return (
    <div className="datatable" key={blockModelId}>
      <DataGrid
        className="datagrid"
        rows={mainContext.allValue.tableData}
        columns={userColumns}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row.centroid_x + row.centroid_y}
      />
    </div>
  )
}

export default DataTable
