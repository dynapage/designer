import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel, Select, Box, MenuItem } from '@mui/material';


const SelectControlfromObject = (props) => {

  const { controlColumn, dataField, options } = props;
  if (controlColumn == true) {
    return (
      <Box component="span" display="block" my={2} whiteSpace="nowrap">
        <InputLabel className="form-label">{props.title ? props.title : null}</InputLabel>
        <Select
          name={props.name ? props.name : null}
          key={props.key}
          value={dataField}
          onChange={props.controlFunc}
          // disabled
          className="form-select">
          <option value={dataField}>{dataField}</option>

        </Select>
      </Box>
    )
  }


  else {
    return (
      <Box sx={{ minWidth: 120 }}>
        <InputLabel id="form-label">{props.title ? props.title : null}</InputLabel>
        <Select
          id={props.name ? props.name : null}
          key={props.key}
          value={props.controlValue}
          label="Age"
          onChange={props.controlFunc}
        >
          <MenuItem value="333">{'Select Me'}</MenuItem>
          {options.map((item) => {
            return (
              <MenuItem key={item.shapevalue} value={item.shapevalue}>
                {item.label}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
    )
  }

};

SelectControlfromObject.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SelectControlfromObject;
