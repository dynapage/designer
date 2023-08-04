import React, { useState } from 'react';
import { TextField, MenuItem, Box, } from '@mui/material';
import CheckBoxControl from '../CheckBoxControl';


const OrderBy = ({ data, columns, controlFunc }) => {

  //const [data, setquery] = useState(data);

  const handleCol = (e) => {
    
    controlFunc({ ...data, col: e.target.value})
  };

  const handleDesc = (e) => {
   
    controlFunc({ ...data, desc: e.target.checked })
  };


  return (
    <Box display="flex" m={0} >
      <Box m={0} >
        <TextField
          style={{ "minWidth": "150px" }}
          id="txt condition"
          label={'Column'}
          select
          value={data.col}
          onChange={handleCol}>
          {
            columns.map((opt) => (
              <MenuItem key={opt._id} value={opt.shapevalue}>
                {opt.shapevalue}
              </MenuItem>
            ))
          }
        </TextField></Box>
      <Box m={1} >
        {data.col==='' ?
          null
          :
          <CheckBoxControl key={'formatdesc'} name={'desc'} controlFunc={(e) => handleDesc(e) } title={'Descending order?'} controlValue={data.desc} />
        }
      </Box>
    </Box>
  )
}


export default OrderBy
