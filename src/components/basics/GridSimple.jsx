import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { InputLabel, Select, MenuItem, Box, } from '@mui/material';
import Button from '@mui/material/Button';
import TransferList from './TransferList';
import GridCustomField from './GridCustomField';
import GridCustomFilter from './GridCustomFilter';
import GridCascade from './GridCascade';
import FormControl from '@mui/material/FormControl';
import { useNavigate } from 'react-router-dom';
//import { fetchColumns } from 'redux/actions/columns';
import columnApi from '../../api/columnApi';

const GridSimple = ({ setSubGridFunction, controlProperties, originalTblId, handlePropChange, title, selectedApp, formId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tables = useSelector((state) => (state.application.value || []).apptables);
  const [columns,  setColumns] = useState([]);

  const originalTableId = useRef(originalTblId);
  const [selecedTable, setTable] = useState(controlProperties.datarefid);
  const [showCustomCol, setshowCustomCol] = useState(0);
  const [disabledSelect, setDisabledSelect] = useState(false);
 // console.log('//---=======GridSimple============================', tables)

 
  useEffect(() => {
    const getColumns = async () => {
      try {
        if (selecedTable)
        {
          const res = await columnApi.getAll(selectedApp._id, selecedTable)
         // console.log('------------useEffect-----------------  ', res)
          setColumns(res)
        }
      } catch (err) {
       alert('Gridsimplecomp--' + err)
    }
    }
    getColumns()
  }, [selecedTable])



  const handleChange = (table_id) => {
    try {
      if (table_id) {
        const tbl = tables.filter(x => x._id == table_id)
        controlProperties.dataref = tbl[0].name;
        controlProperties.label = tbl[0].name;
        controlProperties.datarefid = table_id;
        setTable(table_id);
      }
      else {
        controlProperties.dataref = '';
        controlProperties.label = 'Data Grid';
        controlProperties.datarefid = '';
        setTable(table_id);
      }
    }
    catch (err) {
      console.log(' error @567: ', err)
    }
  };

  const handlePropertiesChange = (returnedValue) => {
    setSubGridFunction(false);
    handlePropChange(returnedValue, 'gridcols');
  };

  const handleCustomCol = (withData, e) => {
    if (!withData) {
      setshowCustomCol(e);
      setDisabledSelect(false);
      setSubGridFunction(true);
    }
    else {

      handlePropChange(e, 'customcols');
      controlProperties.customcols = e;
      setshowCustomCol(0);
      setDisabledSelect(true);
    }
  };

  const handleCustomFilter = (e, withData, relatedParentCol) => {
    setSubGridFunction(false);
    if (!withData) {
      setSubGridFunction(true);
      setshowCustomCol(e);
   
    }
    else {
      if (relatedParentCol) {
        controlProperties.parentcol = e;
      }
      else {
        setshowCustomCol(0);
        handlePropChange(e, 'filters');
        
      }

    };

    setDisabledSelect(false);
  };

  const handleCustomCascade = (e, withData) => {
    setSubGridFunction(false);
    if (!withData) {
      setshowCustomCol(e);
      
      //   setDisabledSelect(false);
    }
    else {
      handlePropChange(e, 'cascade');
      setshowCustomCol(0);
      
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <InputLabel className="form-label">{title}</InputLabel>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <FormControl variant="standard" sx={{ m: 0, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Selected Table</InputLabel>
          <Select
            sx={{ m: 1, minWidth: 120 }}
            disabled={disabledSelect || showCustomCol > 0}
            value={controlProperties.datarefid}
            label="'Selected Table"
            onChange={(val) => { handleChange(val.target.value) }}
            className="form-select">
            <MenuItem value=''>
              <em>None</em>
            </MenuItem>
            {tables && tables.map(value => {
              return (
                <MenuItem name={value.name} key={value._id} value={value._id}>{value.name}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <Box
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',

          }}> <Button
            variant="outlined"
            size="small"
            disabled={!selecedTable || !!disabledSelect || showCustomCol === 3}
            onClick={() => handleCustomFilter(3, false)}
            aria-label="Data query"
          >Grid Cascade</Button></Box>
        <Box
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',

          }}>   <Button
            variant="outlined"
            size="small"
            disabled={!selecedTable || !!disabledSelect || showCustomCol === 2}
            onClick={() => handleCustomFilter(2, false)}
            aria-label="Data query"
          >Data query</Button></Box>

        <Box
          sx={{
            p: 1,
            m: 1,
            bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
            color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 2,
            fontSize: '0.875rem',
            fontWeight: '700',

          }}> <Button
            variant={showCustomCol === 1 ? "" : "outlined"}
            size="small"
            disabled={!controlProperties.id || !selecedTable || !!disabledSelect || showCustomCol === 1}
            onClick={() => handleCustomCol(false, 1)}
            aria-label="add custom column"
          >Virtual Column</Button></Box>

      </Box>

      {showCustomCol === 1 ?
        <GridCustomField columns={columns} tables={tables} ShowEvent={handleCustomCol} SaveEvent={handlePropertiesChange} data={controlProperties}></GridCustomField>
        :
        showCustomCol === 2 ?
          <GridCustomFilter selecedTbl={selecedTable} gridDef={controlProperties} filters={controlProperties.filters} columns={columns} tables={tables} appId={selectedApp._id} ShowEvent={handleCustomFilter}></GridCustomFilter>
          :
          showCustomCol === 3 ?
            <GridCascade cascade={controlProperties.cascade ? controlProperties.cascade : { fldname1: '', fldname2: '', fldid1: '', fldid2: '', val2: '', gridref: '' }} columns={columns} tables={tables} controlProperties={controlProperties} ShowEvent={handleCustomCascade} formId={formId}></GridCascade>
            :
            null
      }
      {selecedTable && !showCustomCol ?
        <TransferList handlePropertiesChange={handlePropertiesChange} tableId={originalTableId.current} columns={columns} tableCols={controlProperties} customcolumns={controlProperties.customcols}></TransferList>
        : null}

    </div >
  )
};

export default GridSimple;
