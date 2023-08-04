import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel, FormControl, Select, MenuItem, Box } from '@mui/material';

export default function SelectControlfromArray(props) {

  // //console.log('---SelectControlfromArray------', props);


  return (

    <Box sx={{
      minWidth: 120, p: 1,
      m: 1,
    }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">{props.title ? props.title : null}</InputLabel>
        <Select
          labelId="data-type-label"
          id={props.name}
          key={props.key}
          name={props.name ? props.name : null}
          value={props.controlValue}
          onChange={props.controlFunc}
        >
          <MenuItem value="">{props.placeholder}</MenuItem>
          {props.options.map((opt) =>
            <MenuItem
              key={opt}
              value={opt}>{opt}</MenuItem>
          )}
        </Select>
      </FormControl> 
  </Box>

  )
};

SelectControlfromArray.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};


