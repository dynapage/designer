import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { InputLabel, Select, MenuItem, Box } from '@mui/material';


const URLControl = ({ name, controlFunc, title, controlValue }) => {

  const { appforms } = useSelector((state) => state.tables);
  //console.log('appforms---', appforms)
  return (
    // <SelectControlfromObject key={'urlse'} controlColumn={false} name={name} controlFunc={controlFunc} options={appforms} title={title} controlValue={controlValue} />

    <Box component="span" display="block" my={2} whiteSpace="nowrap">
    <InputLabel className="form-label">URL to form</InputLabel>
    <Select
      name={name ? name : null}
      value={controlValue}
      onChange={controlFunc}
      className="form-select">
      <MenuItem value="">{}</MenuItem>
      {Object.entries(appforms).map(([key, opt]) => {
        return (
            <MenuItem
              key={opt._id}
              value={opt._id}>{opt.label}</MenuItem>
        );
      })}
    </Select>
  </Box>
    )
}

export default URLControl;

