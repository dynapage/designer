import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel, FormControl, Divider, Select, Box, MenuItem } from '@mui/material';


const SelectTextTypeControl = (props) => {

  const { controlColumn, dataField, options } = props;
  
    return (
      <Box sx={{ minWidth: 120,  p: 1,
        m: 1, }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.title ? props.title : null}</InputLabel>
        <Select
          id={props.name ? props.name : null}
          name={props.name}
          //key={props.key}
          value={props.controlValue}
          label="Text Type"
          onChange={props.controlFunc}
        >
          {options.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {item.value}
              </MenuItem>
            );
          })}
        </Select>
    </FormControl></Box>
    )
};

SelectTextTypeControl.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SelectTextTypeControl;
