import * as React from 'react';
import Drawer from '@mui/material/Drawer';
//import ColumnForm from 'components/Level Table/ColumnForm';
import TableForm from './TableForm';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material'


export default function TableDrawer({ initialState, isEdit, closeOpenFlag, selectedApp, selectedTable, tableColumns, selectedRow, showcolumnForm }) {
  const apptables = useSelector((state) => (state.tables || []).apptables);
  const [state, setState] = React.useState(false);

  const toggleDrawer = (event) => {
    if (event) closeOpenFlag(false);
  };

  React.useEffect(() => {
    setState(initialState);
  }, [initialState]);


  return (

      <Drawer
        anchor={'right'}
        open={state}
        onClose={(event) => toggleDrawer(event)}

      >
        <TableForm selectedApp={selectedApp} closeDrawer={closeOpenFlag}></TableForm>
        {/* {!showcolumnForm? <TableForm selectedApp={selectedApp} closeDrawer={closeOpenFlag}></TableForm>: <ColumnForm isEdit={isEdit} selectedApp={selectedApp} selectedTable={selectedTable} tableColumns={tableColumns} selectedRow={selectedRow} closeDrawer={closeOpenFlag} apptables={apptables}></ColumnForm>} */}

      </Drawer>

  );
}


