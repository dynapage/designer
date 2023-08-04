import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Box, InputLabel, Select, MenuItem } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import ToggleButtons from './ToggleButtons';
import Divider from '@mui/material/Divider';
import Top from './TableFilters/Top';
import Where from './TableFilters/Where';
import OrderBy from './TableFilters/OrderBy';
//import { fetchLookUpTableColumns } from '../../redux/actions/columns';
import columnApi from '../../api/columnApi';

const conditiontype = [{ key: 1, value: 'Order by' }, { key: 2, value: 'WHERE Field' }, { key: 3, value: 'Page Relationship' }];
const operator = [{ key: 1, value: 'AND' }, { key: 2, value: 'OR' }];
const initConditions = [{ condition: 1, operator: 0, col: '', desc: false, oper: 0, val1: '', val2: '', val1ref: '' }
  , { condition: 2, operator: 0, col: '', desc: false, oper: 0, val1: '', val2: '', val1ref: '' }]


const GridCustomFilter = ({ selecedTbl, gridDef, filters, columns, tables, appId, ShowEvent }) => {

  const [isRelationship, setIsRelationship] = useState(false);
  const [defRelationship, setDefRelationship] = useState();
  const [conditions, setconditions] = useState(filters? filters: initConditions);
  const [parentTableColumns, setParentTableColumns] = useState([]);
  console.log('//--++++filters=====++++++++---', filters)

  const handleConditionChange = (newCondition, index) => {

    let newConditions = [...conditions]
    newConditions[index] = { condition: newConditions[index].condition, operator: newConditions[index].operator, ...newCondition }
    setconditions(newConditions)
  };



  const validateAndSubmit = (e) => {
   
    //console.log('//--++++relatinshiponditions======++++++++---', defRelationship)

    //** Check if Relationship toggle selected or other  */
    if (isRelationship) {
      if (defRelationship == 0 || defRelationship == undefined || defRelationship == '') {
        alert('Relaated data grid record can not be empty')
        return
      }
      else {
        ShowEvent(defRelationship, true, isRelationship)
      }
    }
    else {
       ShowEvent(conditions, true, false)
    }
    isRelationship? ShowEvent(defRelationship, true, isRelationship) : ShowEvent(conditions, true, false)
  }

  const handleRelationship = (e) => {
    setIsRelationship(true)
    setDefRelationship(e.target.value)
  };


  const handleOperatorChange = (e, index) => {
    let newConditions = [...conditions]
    newConditions[index].operator = e;
    setconditions(newConditions)
  };

  const handleTop = (e) => {
    let newConditions = [...conditions]
    newConditions[index].condition = e;
    setconditions(newConditions)

  };

  const handleDelete = (e, index) => {
    const newConditions = [...conditions]
    newConditions.splice(index, 1);
    setconditions(newConditions)
    // If all conditions deleted then add an empty item
    if (newConditions.length === 0) {
      setconditions([{ condition: 1, operator: 1, col: '', desc: false, oper: 0, val1: '', val2: '', val1ref: '' }])
    }
  }

  const addRowEvent = () => {
    const cond = { condition: 1, operator: 1, col: '', desc: false, oper: 0, val1: '', val2: '', val1ref: '' }
    const newConditions = [...conditions]
    newConditions.push(cond)
    setconditions(newConditions)
  };


  return (
    <Box  >
      {/* <Box display="flex" p={1} >Order By</Box><Box display="flex" p={1} >
        <OrderBy key={'formatOrderBy'} controlFunc={e => handleConditionChange(e, 0)} columns={columns} data={conditions[0]}></OrderBy>
      </Box>
      <Divider /> */}
      <Box display="flex" p={1} >Where</Box><Box display="flex" p={1} >
        <Where key={'formatWhere'} controlFunc={e => handleConditionChange(e, 1)} tables={tables} columns={columns} appId={appId} data={conditions[1]}></Where>
      </Box>
      <Divider />
      <Box display="flex" p={1} >Page relationship</Box><Box display="flex" p={1} >
        <FormControl variant="standard" sx={{ m: 0, minWidth: 240 }}>
          <InputLabel id="demo-simple-select-label">Related data grid records to:</InputLabel>
          <Select
            required
            labelId="data-type-label"
            id="cbochoiceItems"
            name={'parentrelatedcolumn'}
            value={gridDef.parentcol}
            placeholder={'Data Type'}
            onChange={handleRelationship}
            key={'selectTypedchoiceItems'}
            label="Data Type">
            <MenuItem key={'0val'} value={0}></MenuItem>
            {
              columns.map((opt) => {
                return (
                  <MenuItem key={opt._id} value={opt.shapevalue}>
                    {opt.label}
                  </MenuItem>
                )
              })}
          </Select>
        </FormControl>
      </Box>
      <Divider />
      <Box display="flex" flexDirection="row-reverse" p={1}>
        <Box p={1}>
          <Button
            variant="outlined"
            size="small"
            //  disabled={!conditions[0]}
            onClick={() => validateAndSubmit()}
            aria-label="move selected right"
          >Validate and Close</Button></Box>
        <Box p={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => ShowEvent(0, false)}
            aria-label="move selected right"
          >Cancel</Button></Box>
      </Box>
    </Box>
  )
}

//setDefRelationship

export default GridCustomFilter
