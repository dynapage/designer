
import React, { useState } from 'react';
import { Button, TextField, InputLabel, MenuItem, ListItem, List, Box, } from '@mui/material';

const operatorSum = [{ value: 1, label: 'Plus' }, { value: 2, label: 'Minus' }, { value: 3, label: 'Devide' }, { value: 4, label: 'Times' }];

const CustomColumn = ({ data, columns, controlFunc }) => {


  const handleOperator = (e, fldname) => {
    controlFunc(fldname, e.target.value)
  };

  
  return (
    <Box display="flex" p={0} >
      <Box p={1}>
        <TextField
          style={{ "minWidth": "170px" }}
          id="sum1"
          select
          label={"Select column 1"}
          value={data.col1}
          onChange={(e) => handleOperator(e, 'col1')}>
          {
            columns.map((opt) => (
              <MenuItem key={opt.shapevalue} value={opt.shapevalue}>
                {opt.label}
              </MenuItem>
            ))
          }
        </TextField>
      </Box>
      <Box p={1}>
        {data.opertype == 1 ?
          <TextField
            style={{ "minWidth": "90px" }}
            id="sumoperator1"
            select
            label="Operator 1"
            value={data.opr1}
            onChange={(e) => handleOperator(e, 'opr1')}>
            <MenuItem key={'0'} value={0}></MenuItem>
            {
              operatorSum.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))
            }
          </TextField>
          : data.opertype === 2 ?
            <Box p={0}><br></br><InputLabel className="form-label">{'AND'}</InputLabel></Box>
            :
            <Box p={0}><br></br><InputLabel className="form-label">{'Of'}</InputLabel></Box>
        }
      </Box>
      <Box p={1}>
        <TextField
          style={{ "minWidth": "170px" }}
          id="sum2"
          select
          label="Select column"
          value={data.col2}
          onChange={(e) => handleOperator(e, 'col2')}>
          {
            columns.map((opt) => (
              <MenuItem key={opt.shapevalue} value={opt.shapevalue}>
                {opt.label}
              </MenuItem>
            ))
          }
        </TextField>
        <Box p={0}><InputLabel className="form-label">{'Or'}</InputLabel></Box>
        <TextField
          style={{ "width": "120px" }}
          id="staticsum2"
          type='number'
          label="Static %"
          value={data.col2}
          onChange={(e) => handleOperator(e, 'col2')}>
        </TextField>

      </Box>
      <Box p={1}>
        {data.opertype === 1 ?
          <TextField
            style={{ "minWidth": "90px" }}
            id="sumoperator2"
            select
            label="Operator 2"
            value={data.opr2}
            onChange={(e) => handleOperator(e, 'opr2')}>
            {
              operatorSum.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))
            }
          </TextField>
          : data.opertype === 2 ?
            <Box p={0}><br></br><InputLabel className="form-label">{'AND'}</InputLabel></Box>
            :
            <Box p={0}><br></br><InputLabel className="form-label">{'Of'}</InputLabel></Box>
        }
      </Box>
      <Box p={1}>
        <TextField
          style={{ "minWidth": "170px" }}
          id="sum3"
          select
          label="Select column 3"
          value={data.col3}
          onChange={(e) => handleOperator(e, 'col3')}>
          <MenuItem key={'empty'} value={0}></MenuItem>
          {
            columns.map((opt) => (
              <MenuItem key={opt.shapevalue} value={opt.shapevalue}>
                {opt.label}
              </MenuItem>
            ))
          }
        </TextField>
        <Box p={0}><InputLabel className="form-label">{'Or'}</InputLabel></Box>
        <TextField
          style={{ "width": "120px" }}
          id="staticsum2"
          type='number'
          label="Static %"
          value={data.col3}
          onChange={(e) => handleOperator(e, 'col3')}>
        </TextField>
      </Box>
    </Box>
  )
}


export default CustomColumn
