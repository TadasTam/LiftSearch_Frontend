import React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import {convertTime} from '../../../utils'


const DataTable = ({
  rows,
  columns,
  loading,
}) => {
  
  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid loading={loading} autoHeight rows={rows} columns={columns} density={'comfortable'} sx={{margin:5}} />
    </div>
  );
}

export default DataTable